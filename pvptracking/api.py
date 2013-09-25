from tastypie import fields
from tastypie.resources import ModelResource
from pvptracking.models import PvpEvaluation
from orgstructure.api import EmployeeResource
from tastypie.constants import ALL

class PvpEvaluationResource(ModelResource):
    employee = fields.ToOneField(EmployeeResource, 'employee', full=True)

    class Meta:
        queryset = PvpEvaluation.objects.all()
        resource_name = 'pvp/evaluations'
        filtering = {
            "employee": (ALL),
        }
