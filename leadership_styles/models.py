import blah
from blah.models import Comment
from customers.models import Customer
from django.core.signing import Signer
from django.db import connection, models
from django.db.models import Q, F
from org.models import Employee
from datetime import datetime, date, timedelta
from model_utils import FieldTracker
from tasks import send_leadership_style_request_email, send_quiz_link_email

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


class LeadershipStyleDescription(models.Model):
    style = models.IntegerField(choices=LEADERSHIP_STYLES)
    description = models.TextField()

    @property
    def style_verbose(self):
        return LEADERSHIP_STYLES[self.style][1]

    def __str__(self):
        return self.style_verbose


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


class QuizUrl(models.Model):
    email = models.CharField(max_length=255)
    url = models.CharField(max_length=255, null=True, blank=True)
    invited_by = models.ForeignKey(Employee, related_name='+', null=True, blank=True)
    active = models.BooleanField(default=True)
    completed = models.BooleanField(default=False)
    sent_date = models.DateField(auto_now_add=True)

    def send_quiz_link(self):
        send_quiz_link_email.subtask((self.id,)).apply_async()

    def __str__(self):
        return "%s was sent a self asessment on %s" % (self.email, self.sent_date)


def generate_quiz_link(email, invited_by=None):
    customer = Customer.objects.filter(schema_name=connection.schema_name).first()
    quiz = QuizUrl()
    quiz.active = True
    quiz.email = email
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
        except EmployeeLeadershipStyle.DoesNotExist():
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

    def _calculate_scores(self):
        if not self.completed and self.all_questions_answered() and self.answers.count() > 0:
            self.visionary_score = self.answers.filter(leadership_style=VISIONARY).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.visionary_score,style=VISIONARY))

            self.operator_score = self.answers.filter(leadership_style=OPERATOR).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.operator_score, style=OPERATOR))

            self.processor_score = self.answers.filter(leadership_style=PROCESSOR).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.processor_score, style=PROCESSOR))

            self.synergist_score = self.answers.filter(leadership_style=SYNERGIST).count() * SCORE_MULTIPLIER
            self.scores.add(Score.objects.create_score(score=self.synergist_score, style=SYNERGIST))

            self.date = datetime.now()
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
        if question is None:
            self._calculate_scores()
            self.completed = True
            self.save()
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
        if self.completed and 'update_fields' in kwargs and 'completed' in kwargs['update_fields']:
            self.date = datetime.now()

        super(EmployeeLeadershipStyle, self).save(*args, **kwargs)

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
    name = models.CharField(max_length=255, null=True, blank=True)
    owner = models.ForeignKey(Employee, related_name='+')
    team_members = models.ManyToManyField(Employee, related_name='team_leadership_styles', null=True, blank=True)
    quiz_requests = models.ManyToManyField(QuizUrl, related_name='team_leadership_styles', null=True, blank=True)

    def __str__(self):
        if self.name:
            return "Team %s owned by %s" % (self.name, self.owner.full_name)
        else:
            return "Team owned by %s" % self.owner.full_name
