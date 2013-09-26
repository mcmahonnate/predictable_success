from tastypie import fields
from tastypie.resources import ModelResource
from pvp.models import *
from org.api import *
from tastypie.constants import ALL
from tastypie.authentication import SessionAuthentication

class PvpEvaluationResource(ModelResource):
    employee = fields.ToOneField(EmployeeResource, 'employee', full=True)

    class Meta:
        queryset = PvpEvaluation.objects.all()
        resource_name = 'pvp/evaluations'
        filtering = {
            "employee": (ALL),
        }
        authentication = SessionAuthentication()

class EvaluationRoundResource(ModelResource):
    class Meta:
        queryset = EvaluationRound.objects.all()
        resource_name = 'pvp/evaluations'
        filtering = {
            "employee": (ALL),
        }
        authentication = SessionAuthentication()
