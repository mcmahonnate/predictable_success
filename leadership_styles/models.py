import blah
from blah.models import Comment
from customers.models import Customer
from django.core.signing import Signer
from django.core.exceptions import ValidationError
from django.db import connection, models
from django.db.models import Q, F, Avg
from org.models import Employee
from datetime import datetime, date, timedelta
from model_utils import FieldTracker
from tasks import *

# Styles
VISIONARY = 0
OPERATOR = 1
PROCESSOR = 2
SYNERGIST = 3

LEADERSHIP_STYLES = (
    (VISIONARY, 'Visionary'),
    (OPERATOR, 'Operator'),
    (PROCESSOR, 'Processor'),
    (SYNERGIST, 'Synergist'),
)

# Traits
DOMINANT = 0
PRIMARY = 1
SECONDARY = 2
INACTIVE = 3

DOMINANT_STYLE_MAX = 960
DOMINANT_STYLE_MIN = 480
PRIMARY_STYLE_MAX = 479
PRIMARY_STYLE_MIN = 240
SECONDARY_STYLE_MAX = 239
SECONDARY_STYLE_MIN = 120
INACTIVE_STYLE_MAX = 119
INACTIVE_STYLE_MIN = 0

TRAITS = (
    (DOMINANT, 'Dominant'),
    (PRIMARY, 'Primary'),
    (SECONDARY, 'Secondary'),
    (INACTIVE, 'Inactive'),
)

# Assessment
SELF = 0
OTHERS = 1
ASSESSMENT_TYPE = (
    (SELF, 'Self Assessment'),
    (OTHERS, '360 Assessment')
)

# Scoring
SCORE_MULTIPLIER = 30

#Teams
TEAM_MEMBER_CAP = 11


class LeadershipStyleTease(models.Model):
    style = models.IntegerField(choices=LEADERSHIP_STYLES)
    tease = models.TextField()

    @property
    def style_verbose(self):
        return LEADERSHIP_STYLES[self.style][1]

    def __str__(self):
        return self.style_verbose


class LeadershipStyleDescriptionManager(models.Manager):

    def get_description(self, scores):
        operating_scores = scores.filter(Q(trait=DOMINANT) | Q(trait=PRIMARY) | Q(trait=SECONDARY)).order_by('-score')
        if operating_scores.count() == 4:
            descriptions = self.filter(well_rounded=True, well_rounded_preferred_style=operating_scores[0].style)
        elif operating_scores.count() == 3:
            descriptions = self._get_description_for_multi_scores(operating_scores)
        elif operating_scores.count() == 2:
            descriptions = self._get_description_for_multi_scores(operating_scores)
        else:
            descriptions = self.filter(dominant_style_first=operating_scores[0].style)
        return descriptions[0]

    def get_description_by_list(self, list_of_scores):
        operating_scores = [x for x in list_of_scores if (x['trait'] == DOMINANT or x['trait'] == PRIMARY or x['trait'] == SECONDARY)]
        operating_scores.sort(key=lambda x: x['score'], reverse=True)

        if len(operating_scores) == 4:
            descriptions = self.filter(well_rounded=True, well_rounded_preferred_style=operating_scores[0]['style'])
        elif len(operating_scores) == 3:
            descriptions = self._get_description_for_multi_scores(operating_scores)
        elif len(operating_scores) == 2:
            descriptions = self._get_description_for_multi_scores(operating_scores)
        else:
            descriptions = self.filter(dominant_style_first=operating_scores[0]['style'])
        return descriptions[0]

    def _get_description_for_multi_scores(self, operating_scores):
        if operating_scores[0].score >= DOMINANT_STYLE_MIN:
            descriptions = self.filter(Q(dominant_style_first=operating_scores[0].style) &
                                       (Q(dominant_style_second=operating_scores[1].style) |
                                        Q(secondary_style_first=operating_scores[1].style)))
            if descriptions.count() > 0:
                if operating_scores[1].score >= DOMINANT_STYLE_MIN:
                    d = descriptions.filter(dominant_style_second=operating_scores[1].style)
                    if d.count() > 0:
                        descriptions = d
                    else:
                        if operating_scores.count() == 3:
                            descriptions = descriptions.filter(secondary_style_first=operating_scores[1].style,
                                                               secondary_style_second=operating_scores[2].style)
                        else:
                            descriptions = None

            if descriptions is None or descriptions.count() == 0:
                descriptions = self.filter(primary_style_first=operating_scores[0].style)
                d = descriptions.filter(primary_style_second=operating_scores[1].style)
                if d.count() > 0:
                    descriptions = d
                else:
                    d = descriptions.filter(secondary_style_first=operating_scores[1].style)
                    if d.count() > 0:
                        descriptions = d
                        if operating_scores.count() == 3:
                            d = descriptions.filter(secondary_style_second=operating_scores[2].style)
                            if d.count() > 0:
                                descriptions = d
        else:
            descriptions = self.filter(primary_style_first=operating_scores[0].style)
            d = descriptions.filter(primary_style_second=operating_scores[1].style)
            if d.count() > 0 and operating_scores.count() == 2:
                descriptions = d
            else:
                d = descriptions.filter(secondary_style_first=operating_scores[1].style)
                if d.count() > 0:
                    descriptions = d
                    if operating_scores.count() == 3:
                        d = descriptions.filter(secondary_style_second=operating_scores[2].style)
                        if d.count() > 0:
                            descriptions = d

        return descriptions


class LeadershipStyleDescription(models.Model):
    objects = LeadershipStyleDescriptionManager()
    name = models.CharField(max_length=255)
    dominant_style_first = models.IntegerField(choices=LEADERSHIP_STYLES, null=True, blank=True)
    dominant_style_second = models.IntegerField(choices=LEADERSHIP_STYLES, null=True, blank=True)
    primary_style_first = models.IntegerField(choices=LEADERSHIP_STYLES, null=True, blank=True)
    primary_style_second = models.IntegerField(choices=LEADERSHIP_STYLES, null=True, blank=True)
    secondary_style_first = models.IntegerField(choices=LEADERSHIP_STYLES, null=True, blank=True)
    secondary_style_second = models.IntegerField(choices=LEADERSHIP_STYLES, null=True, blank=True)
    well_rounded_preferred_style = models.IntegerField(choices=LEADERSHIP_STYLES, null=True, blank=True)
    well_rounded = models.BooleanField(default=False)
    description = models.TextField()

    def __str__(self):
        return self.name


class ScoreManager(models.Manager):

    def create_score(self, score, style):
        if score >= DOMINANT_STYLE_MIN:
            trait = DOMINANT
        elif PRIMARY_STYLE_MIN <= score <= PRIMARY_STYLE_MAX:
            trait = PRIMARY
        elif SECONDARY_STYLE_MIN <= score <= SECONDARY_STYLE_MAX:
            trait = SECONDARY
        else:
            trait = INACTIVE

        score = Score(style=style, score=score, trait=trait)
        score.save()
        return score


class Score(models.Model):
    objects = ScoreManager()
    trait = models.IntegerField(choices=TRAITS)
    style = models.IntegerField(choices=LEADERSHIP_STYLES)
    score = models.IntegerField()

    @property
    def trait_verbose(self):
        return TRAITS[self.trait][1]

    @property
    def style_verbose(self):
        return LEADERSHIP_STYLES[self.style][1]

    def __str__(self):
        return "%s %s" % (self.style_verbose, self.score)


class QuizUrl(models.Model):
    email = models.CharField(max_length=255)
    url = models.CharField(max_length=255, null=True, blank=True)
    invited_by = models.ForeignKey(Employee, related_name='+', null=True, blank=True)
    active = models.BooleanField(default=True)
    completed = models.BooleanField(default=False)
    sent_date = models.DateTimeField(auto_now_add=True)
    last_reminder_sent = models.DateTimeField(null=True, blank=True)

    def send_quiz_link(self):
        send_quiz_link_email.subtask((self.id,)).apply_async()

    def send_reminder(self, message, reminded_by_id):
        send_reminder_quiz_link_email.subtask((self.id, message, reminded_by_id)).apply_async()

    def __str__(self):
        return "%s was sent a self asessment on %s" % (self.email, self.sent_date)


def generate_quiz_link(email, invited_by=None):
    customer = Customer.objects.filter(schema_name=connection.schema_name).first()
    quiz = QuizUrl()
    quiz.active = True
    quiz.email = email.strip().lower()

    if invited_by:
        quiz.invited_by = invited_by

    quiz.save()
    signer = Signer()
    signed_id = signer.sign(quiz.id)
    url = customer.build_url('/take-the-quiz/' + signed_id)
    quiz.url = url
    quiz.save()

    return quiz


class QuestionManager(models.Manager):
    def get_next_question(self, employee_leadership_style):
        #get the last question answered
        last_question_answered = employee_leadership_style.last_question_answered

        #if we have not answered any questions start with the first question
        if last_question_answered is None:
            return self.get_first_question(assessment_type=employee_leadership_style.assessment_type)
        previous_question = last_question_answered.previous_question
        if previous_question is None:
            #if we have no previous question get the next question(s)
            next_questions = last_question_answered.next_questions
        else:
            #get any of the previous question's next questions that have not been answered
            next_questions = previous_question.next_questions.exclude(id__in=employee_leadership_style.answers.values_list('question__id', flat=True))
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

    def get_first_question(self, assessment_type):
        question = self.get(previous_question__isnull=True, assessment_type=assessment_type, active=True)
        return question


class Question(models.Model):
    objects = QuestionManager()
    assessment_type = models.IntegerField(choices=ASSESSMENT_TYPE)
    text = models.TextField()
    randomize_answers = models.BooleanField(default=False)
    previous_question = models.ForeignKey('Question', related_name='next_questions', null=True, blank=True)
    randomize_next_questions = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    _answer = None

    @property
    def answer(self):
        return self._answer

    @answer.setter
    def answer(self, value):
        self._answer = value

    def answers(self):
        if self.randomize_answers:
            return self._answers.order_by('?')
        else:
            return self._answers.order_by('order')

    def has_siblings(self):
        if self.previous_question and self.previous_question.next_questions:
            if self.previous_question.next_questions.count() > 1:
                return True
        return False

    def __str__(self):
        return "%s %s" % (self.order, self.text)


class Answer(models.Model):
    text = models.TextField(blank=True, default='')
    leadership_style = models.IntegerField(choices=LEADERSHIP_STYLES)
    question = models.ForeignKey(Question, related_name='_answers', null=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return "%s %s - %s" % (self.order, self.text, LEADERSHIP_STYLES[self.leadership_style][1])


def default_leadership_style_request_expiration_date():
    return datetime.now() + timedelta(weeks=3)


class LeadershipStyleRequestManager(models.Manager):
    def pending_for_reviewer(self, reviewer):
        return self.filter(reviewer=reviewer).filter(submission=None)

    def unanswered_for_requester(self, requester):
        return self.filter(requester=requester).filter(submission=None)

    def recent_leadership_style_requests_ive_sent(self, requester):
        return self.filter(requester=requester)\
            .exclude(expiration_date__lt=datetime.today())

    def recent_leadership_style_requests_ive_sent_that_have_not_been_completed(self, requester):
        requests = self.recent_leadership_style_requests_ive_sent(requester)
        return requests.filter(was_responded_to=False)


class LeadershipStyleRequest(models.Model):
    objects = LeadershipStyleRequestManager()
    expiration_date = models.DateField(null=True, blank=True, default=default_leadership_style_request_expiration_date)
    message = models.TextField(blank=True)
    requester = models.ForeignKey(Employee, related_name='leadership_style_requests')
    request_date = models.DateTimeField(auto_now_add=True)
    reviewer = models.ForeignKey(Employee, related_name='requests_for_leadership_style', null=True, blank=True)
    reviewer_email = models.CharField(max_length=255, null=True, blank=True)
    was_declined = models.BooleanField(default=False)
    was_responded_to = models.BooleanField(default=False)

    def send_notification_email(self):
        send_leadership_style_request_email.subtask((self.id,)).apply_async()

    @property
    def expired(self):
        return not self.has_been_answered and self.expiration_date < datetime.today()

    @property
    def has_been_answered(self):
        return hasattr(self, 'submission')

    def __str__(self):
        return "Leadership style request from %s for %s" % (self.requester, self.reviewer)


class EmployeeLeadershipStyleManager(models.Manager):
    def get_all_finished_for_employee(self, employee):
        return self.filter(employee=employee, assessor=employee, assessment_type=SELF, completed=True)

    def get_all_drafts(self):
        return self.filter(is_draft=True)

    def get_unfinished(self, employee):
        try:
            return self.get(employee=employee, assessor=employee, active=True, completed=False)
        except EmployeeLeadershipStyle.DoesNotExist:
            return None

    def get_all_unfinished(self):
        reminder_date = date.today()-timedelta(weeks=2)
        return self.filter(active=True, completed=False, date__gt=reminder_date, employee=F('assessor'))

    def get_or_create_leadership_style(self, employee):
        try:
            leadership_style = self.get(employee=employee)
        except EmployeeLeadershipStyle.DoesNotExist:
            leadership_style = EmployeeLeadershipStyle(employee=employee, assessor=employee, assessment_type=SELF)
            leadership_style.save()
        return leadership_style


class EmployeeLeadershipStyle(models.Model):
    objects = EmployeeLeadershipStyleManager()
    employee = models.OneToOneField(Employee, related_name='leadership_style')
    assessment_type = models.IntegerField(choices=ASSESSMENT_TYPE)
    assessor = models.ForeignKey(Employee, related_name='+')
    quiz_url = models.ForeignKey(QuizUrl, null=True, blank=True, related_name='employee_leadership_style')
    request = models.ForeignKey(LeadershipStyleRequest, null=True, blank=True, related_name='submission')
    date = models.DateTimeField(null=False, blank=False, default=datetime.now)
    answers = models.ManyToManyField(Answer, related_name='+', null=True, blank=True)
    last_question_answered = models.ForeignKey(Question, related_name='+', null=True, blank=True)
    times_retaken = models.IntegerField(default=0)
    notes = models.TextField(blank=True, default='')
    is_draft = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    field_tracker = FieldTracker(fields=['active', 'is_draft', 'completed'])
    scores = models.ManyToManyField(Score, related_name='employee_leadership_style', null=True, blank=True)

    @property
    def percentage_complete(self):
        question_count = Question.objects.filter(active=True, assessment_type=SELF).count()
        answer_count = self.answers.all().count()
        if answer_count == 0:
            return 0
        else:
            p = (float(answer_count)/float(question_count)) * 100
            p = round(p)
            return int(p)

    def _calculate_scores(self):
        if self.all_questions_answered() and self.answers.count() > 0:
            self.scores.clear()
            self.visionary_score = self.answers.filter(leadership_style=VISIONARY).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.visionary_score, style=VISIONARY))

            self.operator_score = self.answers.filter(leadership_style=OPERATOR).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.operator_score, style=OPERATOR))

            self.processor_score = self.answers.filter(leadership_style=PROCESSOR).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.processor_score, style=PROCESSOR))

            self.synergist_score = self.answers.filter(leadership_style=SYNERGIST).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.synergist_score, style=SYNERGIST))
            self.save()

    @property
    def total_questions(self):
        return Question.objects.filter(assessment_type=self.assessment_type, active=True).count()

    @property
    def total_answered(self):
        return self.answers.count()

    def next_question(self):
        if self.completed:
            return None
        question = Question.objects.get_next_question(self)
        return question

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
                    return answer.leadership_style is not None
                except Answer.DoesNotExist:
                    return self.last_question_answered.next_questions.count() == 0
        return False

    def save(self, *args, **kwargs):
        if 'update_fields' in kwargs and 'completed' in kwargs['update_fields']:
            self.date = datetime.now()
            self._calculate_scores()
            self.save()
            self.send_completed_notification_email()
        super(EmployeeLeadershipStyle, self).save(*args, **kwargs)

    def send_completed_notification_email(self):
        send_completed_notification_email.subtask((self.id,)).apply_async()

    @property
    def comments(self):
        return list(Comment.objects.get_for_object(self))

    def __str__(self):
        return "%s %s %s" % (self.employee.full_name, self.date, self.completed)


class TeamLeadershipStyleManager(models.Manager):

    @staticmethod
    def create_team(owner, customer_id):
        team = TeamLeadershipStyle(owner=owner, customer_id=customer_id)
        team.save()
        team.team_members.add(owner)
        team.save()
        return team

    @staticmethod
    def add_team_members(team, emails):
        if team.will_team_be_full(len(emails)):
            raise ValidationError(message="Teams can only have %s team members." % TEAM_MEMBER_CAP)
        for email in emails:
            user = Employee.objects.get_or_create_user(email=email)
            employee = Employee.objects.get_or_create_employee(user=user)
            team.team_members.add(employee)
            try:
                leadership_style = employee.leadership_style
            except EmployeeLeadershipStyle.DoesNotExist:
                quiz = generate_quiz_link(email=email, invited_by=team.owner)
                team.quiz_requests.add(quiz)
        team.save()
        return team

    def get_teams_by_team_member(self, employee):
        return self.filter(team_members=employee)

    def get_teams_by_owner(self, employee):
        return self.filter(owner=employee)


class TeamLeadershipStyle(models.Model):
    objects = TeamLeadershipStyleManager()
    customer_id = models.CharField(max_length=255)
    requested_report = models.BooleanField(default=False)
    requested_date = models.DateTimeField(null=True, blank=True)
    received_report = models.BooleanField(default=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    owner = models.ForeignKey(Employee, related_name='+')
    team_members = models.ManyToManyField(Employee, related_name='team_leadership_styles', null=True, blank=True)
    quiz_requests = models.ManyToManyField(QuizUrl, related_name='team_leadership_styles', null=True, blank=True)

    @property
    def percentage_complete(self):
        total_complete = 0
        team_member_count = self.team_members.all().count()
        for team_member in self.team_members.all():
            try:
                total_complete += team_member.leadership_style.percentage_complete
            except:
                total_complete += 0
        if team_member_count == 0:
            return 0
        else:
            p = (float(total_complete)/float(team_member_count))
            p = round(p)
            return int(p)

    @property
    def is_team_full(self):
        if self.team_members.all().count() >= TEAM_MEMBER_CAP:
            return True
        return False

    @property
    def visionary_average(self):
        scores = Score.objects.filter(employee_leadership_style__employee__in=self.team_members.all(), style=VISIONARY)
        return scores.aggregate(average=Avg('score'))['average']

    @property
    def operator_average(self):
        scores = Score.objects.filter(employee_leadership_style__employee__in=self.team_members.all(), style=OPERATOR)
        return scores.aggregate(average=Avg('score'))['average']

    @property
    def processor_average(self):
        scores = Score.objects.filter(employee_leadership_style__employee__in=self.team_members.all(), style=PROCESSOR)
        return scores.aggregate(average=Avg('score'))['average']

    @property
    def synergist_average(self):
        scores = Score.objects.filter(employee_leadership_style__employee__in=self.team_members.all(), style=SYNERGIST)
        return scores.aggregate(average=Avg('score'))['average']

    @property
    def number_of_quizes_completed(self):
        return EmployeeLeadershipStyle.objects.filter(employee__in=self.team_members.all(), completed=True).count()

    @property
    def number_of_quizes_started(self):
        return EmployeeLeadershipStyle.objects.filter(employee__in=self.team_members.all(), completed=False).count()

    @property
    def number_of_quizes_not_started(self):
        team_member_count = self.team_members.count()
        quiz_count = EmployeeLeadershipStyle.objects.filter(employee__in=self.team_members.all()).count()
        return team_member_count - quiz_count

    def will_team_be_full(self, new_member_count):
        return (self.team_members.count() + new_member_count) > TEAM_MEMBER_CAP

    def request_team_report(self, message):
        send_team_report_request_email.subtask((self.id, message)).apply_async()

    def __str__(self):
        if self.name:
            return "Team %s owned by %s" % (self.name, self.owner.full_name)
        else:
            return "Team owned by %s" % self.owner.full_name


class TeamAnalysisFollowUp(models.Model):
    employee = models.ForeignKey(Employee, related_name='+', null=False, blank=False)
    date = models.DateTimeField(null=False, blank=False, default=datetime.now)

    def __str__(self):
        return self.employee.full_name
