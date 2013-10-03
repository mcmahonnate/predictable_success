from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.resources import Resource
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.authentication import SessionAuthentication
from org.api import *
from .models import *

class EvaluationRoundResource(ModelResource):
    class Meta:
        authentication = SessionAuthentication()
        queryset = EvaluationRound.objects.all()
        resource_name = 'pvp/rounds'
        ordering = ['date']
        filtering = {
            "id": ('exact'),
        }

class PvpEvaluationResource(ModelResource):
    employee = fields.ToOneField(EmployeeResource, 'employee', full=True)
    evaluation_round = fields.ToOneField(EvaluationRoundResource, 'evaluation_round', full=True)
    talent_category = fields.IntegerField();

    def dehydrate_talent_category(self, bundle):
        return bundle.obj.get_talent_category()

    class Meta:
        authentication = SessionAuthentication()
        queryset = PvpEvaluation.objects.all()
        resource_name = 'pvp/evaluations'
        filtering = {
            "employee": (ALL_WITH_RELATIONS),
            "evaluation_round": ALL_WITH_RELATIONS,
        }
        ordering = ['evaluation_round']

class PvpAggregate(Resource):
    potential_score = fields.IntegerField()
    performance_score = fields.IntegerField()
    num_employees = fields.IntegerField()
    date_of_eval = fields.DateField()

    # def detail_uri_kwargs(self, bundle_or_obj):
    #     kwargs = {}

    #     if isinstance(bundle_or_obj, Bundle):
    #         kwargs['pk'] = bundle_or_obj.obj.uuid
    #     else:
    #         kwargs['pk'] = bundle_or_obj.uuid

    def get_object_list(self, request):
        # how to get all objects
        return ['foo', 'bar', 'baz', 'bum']

    def obj_get_list(self, request=None, **kwargs):
        return ['bar', 'baz']

    def obj_get(self, request=None, **kwargs):
        return 'foo'

    class Meta:
        resource_name = 'pvp/aggregates'
        allowed_methods = ['get']
