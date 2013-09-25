from tastypie import fields
from tastypie.resources import ModelResource
from compensationtracking.models import CompensationSummary
from orgstructure.api import EmployeeResource

class CompensationSummaryResource(ModelResource):
    employee = fields.ToOneField(EmployeeResource, 'employee', full=True)

    class Meta:
        queryset = CompensationSummary.objects.all()
        resource_name = 'comp-summaries'
