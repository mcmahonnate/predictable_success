from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.authentication import SessionAuthentication
from org.models import Employee, Team, Mentorship

class EmployeeResource(ModelResource):
    team = fields.ToOneField('org.api.TeamResource', 'team', full=True, null=True)
    class Meta:
        authentication = SessionAuthentication()
        queryset = Employee.objects.all()
        resource_name = 'org/employees'
        filtering = {
            "id": ('exact'),
        }

class TeamResource(ModelResource):
    leader = fields.ToOneField(EmployeeResource, 'leader')

    class Meta:
        authentication = SessionAuthentication()
        queryset = Team.objects.all()
        resource_name = 'org/teams'
        filtering = {
            "leader": (ALL_WITH_RELATIONS),
        }

class MentorshipResource(ModelResource):
    mentor = fields.ToOneField(EmployeeResource, 'mentor', full=True)
    mentee = fields.ToOneField(EmployeeResource, 'mentee', full=True)

    class Meta:
        authentication = SessionAuthentication()
        queryset = Mentorship.objects.all()
        resource_name = 'org/mentorships'
        filtering = {
            "mentee": (ALL_WITH_RELATIONS),
        }
