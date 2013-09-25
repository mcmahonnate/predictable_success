from tastypie import fields
from tastypie.resources import ModelResource
from orgstructure.models import Employee, Organization, Team, Mentorship
from orgstructure.api import *
from tastypie.constants import ALL_WITH_RELATIONS

class OrganizationResource(ModelResource):
    class Meta:
        queryset = Organization.objects.all()
        resource_name = 'organizations'

class EmployeeResource(ModelResource):
    organization = fields.ToOneField(OrganizationResource, 'organization', full=True)
    team = fields.ToOneField('TeamResource', 'team', full=True)
    class Meta:
        queryset = Employee.objects.all()
        resource_name = 'employees'
        filtering = {
            "id": ('exact'),
        }

class TeamResource(ModelResource):
    leader = fields.ToOneField(EmployeeResource, 'leader', full=True)

    class Meta:
        queryset = Team.objects.all()
        resource_name = 'teams'
        filtering = {
            "leader": (ALL_WITH_RELATIONS),
        }

class MentorshipResource(ModelResource):
    mentor = fields.ToOneField(EmployeeResource, 'mentor', full=True)
    mentee = fields.ToOneField(EmployeeResource, 'mentee', full=True)

    class Meta:
        queryset = Mentorship.objects.all()
        resource_name = 'mentorships'
