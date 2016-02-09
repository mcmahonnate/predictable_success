from django.db import models
from django.db.models import Q
from django.db.models import Count
from org.models import Employee
from datetime import datetime, date
from dateutil.relativedelta import relativedelta


class QuestionManager(models.Manager):
    def get_next_question(self, employee_zone):
        #get the last question answered
        last_question_answered = employee_zone.last_question_answered

        #if we have not answered any questions start with the first question
        if last_question_answered is None:
            return self.get_first_question(employee_zone)
        previous_question = last_question_answered.previous_question
        if previous_question is None:
            #if we have no previous question get the next question(s)
            next_questions = last_question_answered.next_questions
        else:
            #get any of the previous question's next questions that have not been answered
            next_questions = previous_question.next_questions.exclude(id__in=employee_zone.answers.values_list('question__id', flat=True))
            if next_questions.count() == 0:
                #if we don't have any get the next question(s)
                next_questions = last_question_answered.next_questions

        if next_questions.count() > 0:
            #get the next question at random
            return next_questions.order_by('?').first()
        else:
            #if we don't have anymore questions left return None
            return None

        return self.filter()

    def get_first_question(self, employee_zone):
        question = self.get(previous_question__isnull=True, for_new_employees=employee_zone.new_employee)
        return question


class Question(models.Model):
    objects = QuestionManager()
    text = models.TextField()
    randomize_answers = models.BooleanField(default=False)
    previous_question = models.ForeignKey('Question', related_name='next_questions', null=True, blank=True)
    randomize_next_questions = models.BooleanField(default=False)
    for_new_employees = models.BooleanField(default=False)

    def answers(self):
        return self._answers.order_by('?')

    def has_siblings(self):
        if self.previous_question and self.previous_question.next_questions:
            if self.previous_question.next_questions.count() > 1:
                return True
        return False

    def __str__(self):
        return self.text


class Zone(models.Model):
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField(blank=True, default='')
    value = models.IntegerField(default=0)
    tie_breaker = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.tie_breaker:
            try:
                zone = Zone.objects.get(tie_breaker=True)
                if self != zone:
                    zone.tie_breaker = False
                    zone.save()
            except Zone.DoesNotExist:
                pass
        super(Zone, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Answer(models.Model):
    text = models.TextField(blank=True, default='')
    zone = models.ForeignKey(Zone, related_name='+', null=True, blank=True)
    question = models.ForeignKey(Question, related_name='_answers', null=True)

    def __str__(self):
        return self.text


class EmployeeZoneManager(models.Manager):
    def get_all_finished_for_employee(self, employee):
        return self.filter(employee=employee, completed=True)

    def get_unfinished(self, employee):
        try:
            return self.get(employee=employee, completed=False)
        except EmployeeZone.DoesNotExist:
            return None


class EmployeeZone(models.Model):
    objects = EmployeeZoneManager()
    assessor = models.ForeignKey(Employee, related_name='+')
    employee = models.ForeignKey(Employee, related_name='development_zones')
    date = models.DateTimeField(null=False, blank=False, default=datetime.now)
    answers = models.ManyToManyField(Answer, related_name='+', null=True, blank=True)
    zone = models.ForeignKey(Zone, related_name='+', null=True, blank=True)
    new_employee = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    last_question_answered = models.ForeignKey(Question, related_name='+', null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    def advice(self):
        return Advice.objects.get_advice(employee_zone=self)

    def _calculate_zone(self):
        if not self.completed and self.all_questions_answered() and self.answers.count() > 0:
            if not self.last_question_answered.has_siblings():
                last_answers = self.answers.filter(question__id=self.last_question_answered.id)
            else:
                last_answers = self.answers.filter(question__previous_question__id=self.last_question_answered.previous_question.id)
            zone_count = last_answers.values('zone__name', 'zone').annotate(count=Count('zone__name')).order_by('-count')
            if len(zone_count) > 1 and zone_count[0]['count'] == 1:
                self.zone = Zone.objects.get(tie_breaker=True)
            else:
                zone_id = zone_count[0]['zone']
                self.zone = Zone.objects.get(id=zone_id)
            self.save()

    def next_question(self):
        self._calculate_zone()
        if self.completed:
            return None
        return Question.objects.get_next_question(self)

    def all_questions_answered(self):
        if self.last_question_answered is not None:
            if self.last_question_answered.has_siblings():
                previous_question = self.last_question_answered.previous_question
                questions_answered_ids = self.answers.values_list('question__id', flat=True)
                sibling_ids = previous_question.next_questions.values_list('id', flat=True)
                return set(sibling_ids).issubset(questions_answered_ids)
            else:
                try:
                    answer = self.answers.get(question__id=self.last_question_answered.id)
                    return answer.zone is not None
                except Answer.DoesNotExist:
                    return self.last_question_answered.next_questions.count() == 0
        return False

    def save(self, *args, **kwargs):
        if not self.pk:
            if date.today() < (self.employee.hire_date + relativedelta(months=3)):
                self.new_employee = True
        super(EmployeeZone, self).save(*args, **kwargs)

    def __str__(self):
        return "%s %s %s" % (self.employee.full_name, self.date, self.completed)


class ConversationManager(models.Manager):
    def get_current_for_employee(self, employee):
        conversations = self.get_all_for_employee(employee=employee)
        if conversations.count() > 0:
            return conversations.latest('date')
        return None

    def get_all_for_employee(self, employee):
        return self.filter(employee=employee)

    def get_conversations_for_lead(self, development_lead):
        return self.filter(development_lead=development_lead, completed=False)


class Conversation(models.Model):
    objects = ConversationManager()
    date = models.DateTimeField(null=False, blank=False, default=datetime.now)
    employee = models.ForeignKey(Employee, related_name='development_conversations')
    development_lead = models.ForeignKey(Employee, related_name='people_ive_had_development_conversations_about')
    employee_assessment = models.OneToOneField(EmployeeZone, related_name='development_conversation', null=True, blank=True)
    development_lead_assessment = models.OneToOneField(EmployeeZone, related_name='+', null=True, blank=True)
    completed = models.BooleanField(default=False)
    completed_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "%s's development conversation about %s" % (self.development_lead.full_name, self.employee.full_name)


class AdviceManager(models.Manager):
    def get_advice(self, employee_zone):
        if employee_zone.zone is None:
            return None
        try:
            if employee_zone.development_conversation is not None\
                            and employee_zone.development_conversation.development_lead_assessment is not None\
                            and employee_zone.development_conversation.development_lead_assessment.zone is not None:
                        return self.filter(Q(employee_zone=employee_zone.zone) &
                                           (Q(development_lead_zone__isnull=True) |
                                            Q(employee_zone.development_conversation.development_lead_assessment.zone)))
        except AttributeError:
            pass
        return self.filter(employee_zone=employee_zone.zone, development_lead_zone__isnull=True)




class Advice(models.Model):
    objects = AdviceManager()
    employee_zone = models.ForeignKey(Zone, related_name='+')
    development_lead_zone = models.ForeignKey(Zone, related_name='+', blank=True, null=True)
    advice_name_for_employee = models.CharField(max_length=255, blank=True, default='')
    advice_description_for_employee = models.TextField(blank=True, default='')
    advice_name_for_development_leader = models.CharField(max_length=255, blank=True, default='')
    advice_description_for_development_leader = models.TextField(blank=True, default='')

    def __str__(self):
        return "Advice when employee says %s" % self.employee_zone.name