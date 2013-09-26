from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.authentication import SessionAuthentication
from pvp.models import *
from org.api import *

class EvaluationRoundResource(ModelResource):
    class Meta:
        authentication = SessionAuthentication()
        queryset = EvaluationRound.objects.all()
        resource_name = 'pvp/rounds'

class PvpEvaluationResource(ModelResource):
    employee = fields.ToOneField(EmployeeResource, 'employee', full=True)
    evaluation_round = fields.ToOneField(EvaluationRoundResource, 'evaluation_round', full=True)

    class Meta:
        authentication = SessionAuthentication()
        queryset = PvpEvaluation.objects.all()
        resource_name = 'pvp/evaluations'
        filtering = {
            "employee": (ALL_WITH_RELATIONS),
        }
