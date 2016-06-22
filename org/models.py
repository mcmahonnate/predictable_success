from blah.models import Comment
from customers.models import Customer
from django.contrib.auth.models import User, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.validators import validate_email
from django.db import connection, models
from django.db.models import Count, F, Q
from django.utils.translation import ugettext as _
from model_utils import Choices, FieldTracker
from mptt.models import MPTTModel, TreeForeignKey, TreeManager
from StringIO import StringIO
from PIL import Image, ExifTags
import datetime
import blah


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


class EmployeeManager(TreeManager):
    def get_current_coaches(self):
        coaches = self.get_current_employees()
        return coaches.exclude(coachees__isnull=True).order_by('full_name')

    def get_available_coaches(self, employee):
        coaches = self.filter(coaching_profile__isnull=False)
        coaches = coaches.exclude(coaching_profile__blacklist=employee)
        return coaches.annotate(coachee_count=Count('coachees'))\
            .filter(coaching_profile__max_allowed_coachees__gt=F('coachee_count'))

    def get_current_employees(self, team_id=None, show_hidden=False):
        employees = self.filter(departure_date__isnull=True)
        if not show_hidden:
            employees = employees.filter(display=True)
        if team_id is not None:
            employees = employees.filter(team_id=team_id)
        return employees

    def get_current_employees_employee_has_access_to(self, employee, show_hidden=False):
        employees = self.get_current_employees(show_hidden=show_hidden)
        if (employee.user.has_perm('org.view_employees')):
            return employees

        coachee_ids = self.get_current_employees_by_coach(coach_id=employee.id).values_list('id', flat=True)
        descendant_ids = employee.get_descendants().values_list('id', flat=True)
        employees = employees.filter(Q(id__in=coachee_ids) | Q(id__in=descendant_ids))
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
        employees = self.get_current_employees(show_hidden=show_hidden)
        employees = employees.filter(coach_id=coach_id)
        return employees

    def get_from_user(self, user):
        return self.filter(user=user).get()

    def get_all_access_employees(self):
        content_type = ContentType.objects.get_for_model(Employee)
        perm = Permission.objects.get(content_type=content_type, codename='view_employees')
        users = User.objects.filter(Q(groups__permissions=perm) | Q(user_permissions=perm)).distinct()

        employees = self.filter(user__in=users)
        return employees


class Employee(MPTTModel):
    objects = EmployeeManager()
    _can_view_all_employees = None
    MALE = 'M'
    FEMALE = 'F'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    )

    _current_leadership = None

    full_name = models.CharField(max_length=255,)
    first_name = models.CharField(max_length=255, null=True, blank=True,)
    last_name = models.CharField(max_length=255, null=True, blank=True,)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    namely_id = models.CharField(max_length=255, null=True, blank=True,)
    yei_id = models.CharField(max_length=255, null=True, blank=True,)
    slack_name = models.CharField(max_length=255, null=True, blank=True,)
    avatar = models.ImageField(upload_to="media/avatars/%Y/%m/%d", max_length=100, blank=True, default="/media/avatars/geneRick.jpg")
    avatar_small = models.ImageField(upload_to="media/avatars/small/%Y/%m/%d", max_length=100, null=True, blank=True, default="/media/avatars/small/geneRick.jpeg")
    job_title = models.CharField(max_length=255, blank=True,)
    email = models.CharField(max_length=255, blank=True,)
    hire_date = models.DateField(null=True,)
    departure_date = models.DateField(null=True, blank=True, default=None)
    team = models.ForeignKey('Team', null=True, blank=True, default=None)
    display = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='employee')
    coach = models.ForeignKey('Employee', related_name='coachees', null=True, blank=True)
    leader = TreeForeignKey('self', null=True, blank=True, related_name='employees', db_index=True)
    field_tracker = FieldTracker(fields=['coach', 'departure_date', 'email'])

    def upload_avatar(self, file, mime_type):
        def resize(image, size, filename, extension, content_type):
            image.thumbnail(size, Image.ANTIALIAS)
            image_io = StringIO()
            image.save(image_io, format=extension)
            image_file = InMemoryUploadedFile(image_io, None, filename, content_type, image_io.len, None)
            return image_file
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        image = Image.open(file)
        extension = image.format

        if hasattr(image, '_getexif'): # only present in JPEGs
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == 'Orientation':
                    break
            e = image._getexif()       # returns None if no EXIF data
            if e is not None:
                exif=dict(e.items())
                orientation = exif.get(orientation, None)
                if orientation == 3: image = image.transpose(Image.ROTATE_180)
                elif orientation == 6: image = image.transpose(Image.ROTATE_270)
                elif orientation == 8: image = image.transpose(Image.ROTATE_90)

        filename = str(tenant.pk) + ' ' + str(self.id)
        #resize to avatar size
        avatar_size = (215, 215)
        avatar_file = resize(image, avatar_size, filename, extension, mime_type)
        self.avatar = avatar_file

        #resize to small avatar size
        avatar_small_size = (75, 75)
        avatar_small_file = resize(image, avatar_small_size, filename, extension, mime_type)
        self.avatar_small = avatar_small_file
        self.save()

    def update_coach(self, coach):
        try:
            old_coach_capacity = None
            if self.coach:
                old_coach_capacity = CoachCapacity.objects.get(employee=self.coach)

            coach_capacity = CoachCapacity.objects.get(employee=coach)
            if coach_capacity.is_full():
                raise CoachCapacityError()
            else:
                self.coach = coach
                self.save()
                coach_capacity.save()
                if old_coach_capacity:
                    old_coach_capacity.save()
        except CoachCapacity.DoesNotExist:
            pass

    def save(self, *args, **kwargs):
        if self.first_name and self.last_name:
            self.full_name = self.first_name + " " + self.last_name
        super(Employee, self).save(*args, **kwargs)
        if self.field_tracker.has_changed('departure_date') and self.coach is not None:
            coach_capacity = CoachCapacity.objects.get(employee=self.coach)
            coach_capacity.save()
        if self.field_tracker.has_changed('email') and self.user is not None:
            self.user.email = self.email
            try:
                # Sometimes the username can be an email address
                validate_email(self.user.username)
                self.user.username = self.email.split("@")[0]
            except ValidationError as e:
                pass
            self.user.save()
        new_leader_id = self.leader.id if self.leader else 0
        old_leader_id = self.current_leader.id if self.current_leader else 0
        if new_leader_id != old_leader_id:
            leadership = Leadership(employee=self, leader=self.leader)
            leadership.save()
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

    @property
    def can_view_all_employees(self):
        if self._can_view_all_employees is None:
            self._can_view_all_employees = self.user.has_perm('org.view_employees')
        return self._can_view_all_employees

    def is_coach(self):
        coach_count = Employee.objects.filter(coach__id=self.id, departure_date__isnull=True).count()
        return coach_count > 0

    def is_lead(self):
        leadership_count = Employee.objects.filter(leader__id=self.id, departure_date__isnull=True).count()
        return leadership_count > 0

    def is_viewable_by_user(self, user, allowCoach=True):
        if user.employee.can_view_all_employees:
            return True
        if self.user and self.user == user:
            return True
        if self.coach and self.coach.user and self.coach.user == user and allowCoach:
            return True
        if user.employee.is_ancestor_of(self):
            return True

        return False

    def is_ancestor_of(self, other, include_self=False):
        if self.user.has_perm('org.view_employees'):
            return True
        else:
            return super(Employee, self).is_ancestor_of(other, include_self)

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

    def _get_current_dev_zone(self):
        try:
            conversations = self.development_conversations.filter(development_lead_assessment__isnull=False)
            conversations = conversations.filter(development_lead_assessment__completed=True)
            conversation = conversations.latest('development_lead_assessment__date')
            return conversation.development_lead_assessment
        except:
            return None

    def __str__(self):
        return self.full_name

    def current_talent_category(self):
        pvp = self._get_current_pvp()
        devzone = self._get_current_dev_zone()
        talent_category = 0
        if pvp is not None and devzone is not None:
            if pvp.evaluation_round.date > devzone.date.date():
                talent_category = pvp.talent_category()
            else:
                talent_category = devzone.zone.value
        elif pvp is not None:
            talent_category = pvp.talent_category()
        elif devzone is not None:
            talent_category = devzone.zone.value
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
            ("view_employees", "Can view employees"),
            ("create_employee_comments", "Can create comments on employees"),
            ("view_employee_comments", "Can view comments on employees"),
            ("view_employees_I_lead", "Can view employees I lead"),
        )

    class MPTTMeta:
        parent_attr = 'leader'
        order_insertion_by = ['full_name']


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


class CoachCapacity(models.Model):
    employee = models.OneToOneField(Employee, related_name='+')
    max_allowed_coachees = models.IntegerField(default=0)
    num_coachees = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        self.num_coachees = self.employee.coachees.filter(departure_date__isnull=True).count()
        super(CoachCapacity, self).save(*args, **kwargs)

    def is_full(self):
        return self.num_coachees >= self.max_allowed_coachees

    def __unicode__(self):
        return self.employee.full_name


class CoachCapacityError(Exception):
    pass


class CoachProfile(models.Model):
    employee = models.ForeignKey(Employee, related_name='coaching_profile')
    max_allowed_coachees = models.IntegerField(default=0)
    blacklist = models.ManyToManyField(Employee, related_name='+', null=True, blank=True)
    approach = models.TextField(blank=True, default='')

    def __str__(self):
        return "%s's coaching profile" % self.employee.full_name