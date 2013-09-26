from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.authentication import SessionAuthentication
from comp.models import CompensationSummary
from org.api import EmployeeResource

class CompensationSummaryResource(ModelResource):
    employee = fields.ToOneField(EmployeeResource, 'employee', full=True)
    total_compensation = fields.DecimalField(readonly=True)

    def dehydrate_total_compensation(self, bundle):
        return float(bundle.obj.total_compensation())

    def dehydrate_salary(self, bundle):
        return float(bundle.obj.salary)

    def dehydrate_bonus(self, bundle):
        return float(bundle.obj.bonus)

    def dehydrate_discretionary(self, bundle):
        return float(bundle.obj.discretionary)

    def dehydrate_writer_payments_and_royalties(self, bundle):
        return float(bundle.obj.writer_payments_and_royalties)

    class Meta:
        authentication = SessionAuthentication()
        queryset = CompensationSummary.objects.all()
        resource_name = 'comp/summaries'
