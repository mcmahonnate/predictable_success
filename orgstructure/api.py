from tastypie import fields, utils
from tastypie.resources import ModelResource
from orgstructure.models import Employee, Organization, Team, Mentorship
from orgstructure.api import *

class OrganizationResource(ModelResource):
    class Meta:
        queryset = Organization.objects.all()
        resource_name = 'organizations'

class EmployeeResource(ModelResource):
    class Meta:
        queryset = Employee.objects.all()
        resource_name = 'employees'

class TeamResource(ModelResource):
    leader = fields.ToOneField(EmployeeResource, 'leader', full=True)
    members = fields.ToManyField(EmployeeResource, 'members', full=True)

    class Meta:
        queryset = Team.objects.all()
        resource_name = 'teams'

class MentorshipResource(ModelResource):
    mentor = fields.ToOneField(EmployeeResource, 'mentor', full=True)
    mentee = fields.ToOneField(EmployeeResource, 'mentee', full=True)

    class Meta:
        queryset = Mentorship.objects.all()
        resource_name = 'mentorships'
