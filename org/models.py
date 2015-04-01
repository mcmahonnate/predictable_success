from django.db import models
from django.contrib.auth.models import User
import datetime
import blah

COACHES_GROUP = 'CoachAccess'


class EmployeeManager(models.Manager):
    def coaches(self):
        return self.filter(user__groups__name=COACHES_GROUP).order_by('full_name')

    def get_from_user(self, user):
        return self.filter(user=user).get()


class Employee(models.Model):
    objects = EmployeeManager()

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
    display = models.BooleanField()
    team = models.ForeignKey(
        'Team',
        null=True,
        blank=True,
        default=None
    )
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    coach = models.ForeignKey('Employee', related_name='coachees', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.first_name and self.last_name:
            self.full_name = self.first_name + " " + self.last_name
        super(Employee, self).save(*args, **kwargs)

    def is_coach(self):
        if self.user is None:
            return False
        return any(group.name == COACHES_GROUP for group in self.user.groups.all())

    def _get_kolbe_fact_finder(self):
        try:
            value = int(self.attributes.get(category__id=8).name)
            if value < 4:
                description = 'simplify'
            elif value > 6:
                description = 'specify'
            else:
                description = 'explain'
            return description
        except:
            return None

    def _get_kolbe_follow_thru(self):
        try:
            value = int(self.attributes.get(category__id=9).name)
            if value < 4:
                description = 'adapt'
            elif value > 6:
                description = 'systemize'
            else:
                description = 'maintain'
            return description
        except:
            return None

    def _get_kolbe_quick_start(self):
        try:
            value = int(self.attributes.get(category__id=10).name)
            if value < 5:
                description = 'stabilize'
            elif value > 6:
                description = 'improvise'
            else:
                description = 'modify'
            return description
        except:
            return None

    def _get_kolbe_implementor(self):
        try:
            value = int(self.attributes.get(category__id=11).name)
            if value < 4:
                description = 'imagine'
            elif value > 6:
                description = 'build'
            else:
                description = 'restore'
            return description
        except:
            return None

    def _get_vops_visionary(self):
        try:
            return int(self.attributes.get(category__id=13).name)
        except:
            return None

    def _get_vops_operator(self):
        try:
            return int(self.attributes.get(category__id=14).name)
        except:
            return None

    def _get_vops_processor(self):
        try:
            return int(self.attributes.get(category__id=15).name)
        except:
            return None

    def _get_vops_synergist(self):
        try:
            return int(self.attributes.get(category__id=16).name)
        except:
            return None

    def _get_current_happiness(self):
        try:
            return self.happys.latest('assessed_date')
        except:
            return None

    def _get_current_leader(self):
        try:
            obj = self.leaderships.latest('start_date')
            return obj.leader
        except:
            return None

    def _get_current_pvp(self):
        try:
            obj = self.pvp.latest('evaluation_round__date')
            return obj.talent_category()
        except:
            return None

    def __str__(self):
        return self.full_name

    @property
    def current_pvp(self):
        return self._get_current_pvp()

    @property
    def current_leader(self):
        return self._get_current_leader()

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


blah.register(Employee)


class Team(models.Model):
    name = models.CharField(
        max_length=255,
    )
    leader = models.OneToOneField('Employee', related_name='+')

    def __str__(self):
        return self.name


blah.register(Team)


class Mentorship(models.Model):
    mentor = models.ForeignKey(Employee, related_name='+')
    mentee = models.ForeignKey(Employee, related_name='+')

    def __str__(self):
        return "%s mentor of %s" % (self.mentor.full_name, self.mentee.full_name)


class Leadership(models.Model):
    leader = models.ForeignKey(Employee, related_name='+')
    employee = models.ForeignKey(Employee, related_name='leaderships')
    start_date = models.DateField(null=False, blank=False, default=datetime.date.today)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return "%s leader of %s" % (self.leader.full_name, self.employee.full_name)


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

    def __str__(self):
        return self.name        