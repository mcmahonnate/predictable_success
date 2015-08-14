from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils.translation import ugettext as _
import datetime
import blah
from blah.models import Comment
from model_utils import Choices, FieldTracker
from django.utils.log import getLogger

logger = getLogger(__name__)

COACHES_GROUP = 'CoachAccess'


class Relationship(models.Model):
    RELATION_TYPES = Choices(
        ('coach', _('Coach')),
        ('leader', _('Leader')),
    )
    employee = models.ForeignKey('Employee', related_name='subject_relationships')
    related_employee = models.ForeignKey('Employee', related_name='object_relationships')
    relation_type = models.CharField(max_length=25, choices=RELATION_TYPES, null=False, blank=False)
    start_date = models.DateField(null=False, blank=False, default=datetime.date.today)
    end_date = models.DateField(null=True, blank=True)

    @property
    def relation_type_name(self):
        return Relationship.RELATION_TYPES[self.relation_type]

    def __unicode__(self):
        return '{0} has {1} {2}'.format(self.employee, self.relation_type_name, self.related_employee)


class EmployeeManager(models.Manager):
    def coaches(self):
        return self.filter(user__groups__name=COACHES_GROUP).order_by('full_name')

    def get_current_employees(self, team_id=None, show_hidden=False):
        employees = self.filter(departure_date__isnull=True)
        if not show_hidden:
            employees = employees.filter(display=True)
        if team_id is not None:
            employees = employees.filter(team_id=team_id)
        return employees

    def get_current_employees_by_group_name(self, name, show_hidden=False):
        employees = self.get_current_employees(show_hidden=show_hidden)
        employees = employees.filter(user__groups__name=name)
        return employees

    def get_current_employees_by_team(self, team_id):
        employees = self.get_current_employees()
        employees = employees.filter(team__id=team_id)
        return employees

    def get_current_employees_by_team_lead(self, lead_id):
        employees = self.get_current_employees()
        employees = employees.filter(leaderships__leader__id=lead_id)
        return employees

    def get_current_employees_by_coach(self, coach_id, show_hidden=False):
        employees = self.get_current_employees()
        employees = employees.filter(coach_id=coach_id)
        return employees.exclude(display=show_hidden)

    def get_from_user(self, user):
        return self.filter(user=user).get()


class Employee(models.Model):
    objects = EmployeeManager()
    _current_leadership = None

    full_name = models.CharField(
        max_length=255,
    )
    first_name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    last_name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    linkedin_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    avatar = models.ImageField(
        upload_to="media/avatars/%Y/%m/%d",
        max_length=100,
        blank=True,
        default="/media/avatars/geneRick.jpg"
    )
    avatar_small = models.ImageField(
        upload_to="media/avatars/small/%Y/%m/%d",
        max_length=100,
        null=True,
        blank=True,
        default="/media/avatars/small/geneRick.jpeg"
    )
    job_title = models.CharField(
        max_length=255,
        blank=True,
    )
    email = models.CharField(
        max_length=255,
        blank=True,
    )
    hire_date = models.DateField(
        null=True,
    )
    departure_date = models.DateField(
        null=True,
        blank=True,
        default=None
    )
    team = models.ForeignKey(
        'Team',
        null=True,
        blank=True,
        default=None
    )
    display = models.BooleanField(default=False)
    is_coach = models.BooleanField(default=False)
    is_lead = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='employee')
    coach = models.ForeignKey('Employee', related_name='coachees', null=True, blank=True)
    field_tracker = FieldTracker(fields=['coach'])

    def save(self, *args, **kwargs):
        new_leadership = None
        old_leadership = None

        if self.first_name and self.last_name:
            self.full_name = self.first_name + " " + self.last_name
        if self._current_leadership is not None:
            new_leadership = self._current_leadership
            old_leadership = self._get_current_leadership()
            old_leader_id = old_leadership.leader.id if (old_leadership is not None) and (old_leadership.leader is not None) else 0
            new_leader_id = self._current_leadership.leader.id if self._current_leadership.leader is not None else 0
        super(Employee, self).save(*args, **kwargs)
        if (new_leadership is not None) and (old_leader_id != new_leader_id):
            new_leadership.employee = self
            new_leadership.save()
        self._update_relationships()

    def _update_relationships(self):
        self._update_relationship('coach', Relationship.RELATION_TYPES.coach)

    def _update_relationship(self, field_name, relation_type):
        if self.field_tracker.has_changed(field_name):
            Relationship.objects\
                .filter(employee=self)\
                .filter(end_date=None)\
                .filter(relation_type=relation_type)\
                .update(end_date=datetime.datetime.today())
            field_value = getattr(self, field_name)
            if field_value is not None:
                Relationship(employee=self, related_employee=field_value, relation_type=relation_type).save()

    def is_viewable_by_user(self, user):
        return user.is_superuser or self.user == user or self.coach.user == user or self.current_leader.user == user

    def is_a_coach(self):
        if self.user is None:
            return False
        return any(group.name == COACHES_GROUP for group in self.user.groups.all())

    def _get_kolbe_fact_finder(self):
        try:
            name = self.assessments.get(category__name='Fact Finder').get_name
            return name
        except:
            return None

    def _get_kolbe_follow_thru(self):
        try:
            name = self.assessments.get(category__name='Follow Thru').get_name
            return name
        except:
            return None

    def _get_kolbe_quick_start(self):
        try:
            name = self.assessments.get(category__name='Quick Start').get_name
            return name
        except:
            return None

    def _get_kolbe_implementor(self):
        try:
            name = self.assessments.get(category__name='Implementor').get_name
            return name
        except:
            return None

    def _get_vops_visionary(self):
        try:
            return self.assessments.get(category__name='Visionary').score
        except:
            return None

    def _get_vops_operator(self):
        try:
            return self.assessments.get(category__name='Operator').score
        except:
            return None

    def _get_vops_processor(self):
        try:
            return self.assessments.get(category__name='Processor').score
        except:
            return None

    def _get_vops_synergist(self):
        try:
            return self.assessments.get(category__name='Synergist').score
        except:
            return None

    def _get_current_happiness(self):
        try:
            return self.happys.latest('assessed_date')
        except:
            return None

    def _get_current_leadership(self):
        try:
            obj = self.leaderships.last()
            return obj
        except:
            return None

    def _get_current_pvp(self):
        try:
            pvps = self.pvp.exclude(Q(is_complete=False) & Q(evaluation_round__is_complete=False))
            obj = pvps.latest('evaluation_round__date')
            return obj
        except:
            return None

    def __str__(self):
        return self.full_name

    def current_talent_category(self):
        pvp = self._get_current_pvp()
        talent_category = 0
        if pvp is not None:
            talent_category = pvp.talent_category()
        return talent_category

    def current_talent_category_date(self):
        pvp = self._get_current_pvp()
        date = None
        if pvp is not None:
            date = pvp.evaluation_round.date
        return date

    @property
    def current_pvp(self):
        return self._get_current_pvp()

    @property
    def last_comment_about(self):
        try:
            comments = Comment.objects.get_comments_for_employee(employee=self)
            comment = comments.latest('created_date')
            return comment
        except:
            return None

    @property
    def last_checkin_about(self):
        try:
            checkins = self.checkins.all()
            checkin = checkins.latest('date')
            return checkin
        except:
            return None

    @property
    def current_leader(self):
        self._current_leadership = self._get_current_leadership()
        return self._current_leadership.leader if self._current_leadership else None

    @current_leader.setter
    def current_leader(self, value):
        self._current_leadership = Leadership(employee=self, leader=value)

    @property
    def current_happiness(self):
        return self._get_current_happiness()

    @property
    def get_kolbe_fact_finder(self):
        return self._get_kolbe_fact_finder()

    @property
    def get_kolbe_follow_thru(self):
        return self._get_kolbe_follow_thru()

    @property
    def get_kolbe_quick_start(self):
        return self._get_kolbe_quick_start()

    @property
    def get_kolbe_implementor(self):
        return self._get_kolbe_implementor()

    @property
    def get_vops_visionary(self):
        return self._get_vops_visionary()

    @property
    def get_vops_operator(self):
        return self._get_vops_operator()

    @property
    def get_vops_processor(self):
        return self._get_vops_processor()

    @property
    def get_vops_synergist(self):
        return self._get_vops_synergist()

    @property
    def get_comp(self):
        return self._get_comp()

    class Meta:
        permissions = (
            ("view_employee", "Can view employees"),
            ("create_employee_comments", "Can create comments on employees"),
            ("view_employee_comments", "Can view comments on employees"),
        )


blah.register(Employee)


class Team(models.Model):
    name = models.CharField(
        max_length=255,
    )
    leader = models.OneToOneField('Employee', related_name='+', null=True, blank=True)

    def __str__(self):
        return self.name


blah.register(Team)


class Mentorship(models.Model):
    mentor = models.ForeignKey(Employee, related_name='+')
    mentee = models.ForeignKey(Employee, related_name='+')

    def __str__(self):
        return "%s mentor of %s" % (self.mentor.full_name, self.mentee.full_name)


class Leadership(models.Model):
    leader = models.ForeignKey(Employee, related_name='+', null=True, blank=True)
    employee = models.ForeignKey(Employee, related_name='leaderships')
    start_date = models.DateField(null=False, blank=False, default=datetime.date.today)
    end_date = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            Leadership.objects.filter(employee__id=self.employee.id).update(end_date=datetime.date.today())
        super(Leadership, self).save(*args, **kwargs)

    def __str__(self):
        leader_name = 'No one'
        if self.leader is not None:
            leader_name = self.leader.full_name

        return "%s leads %s" % (leader_name, self.employee.full_name)


class Attribute(models.Model):
    employee = models.ForeignKey(Employee, related_name='attributes')
    name = models.CharField(
        max_length=255,
        blank=True,
    )
    category = models.ForeignKey(
        'AttributeCategory',
        null=True,
        blank=True,
        default=None
    )

    def __str__(self):
        return "%s is a %s for %s" % (self.employee.full_name, self.name, self.category.name)


class AttributeCategory(models.Model):
    name = models.CharField(
        max_length=255,
        blank=True,
    )
    display = models.BooleanField(default=False)

    def __str__(self):
        return self.name
