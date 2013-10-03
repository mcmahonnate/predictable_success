from django.conf.urls import url
from tastypie import fields
from tastypie.exceptions import NotFound
from tastypie.bundle import Bundle
from tastypie.serializers import Serializer
from tastypie.resources import ModelResource
from tastypie.resources import Resource
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.authentication import SessionAuthentication
from org.api import *
from .models import *
from .talent_categorization import get_most_recent_talent_category_report_for_all_employees, get_most_recent_talent_category_report_for_team, TalentCategoryReport

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

class TalentCategoryReportResource(Resource):
    evaluation_date = fields.DateField(attribute='evaluation_date')
    categories = fields.DictField()
    total_evaluations = fields.IntegerField(attribute='total_evaluations')

    def dehydrate_categories(self, bundle):
        categories_dict = {}
        for category in bundle.obj.categories:
            categories_dict[category.talent_category] = category.count
        return categories_dict;

class AllEmployeesTalentCategoryReportResource(TalentCategoryReportResource):

    def obj_get(self, bundle, **kwargs):
        return get_most_recent_talent_category_report_for_all_employees()

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/$" % self._meta.resource_name,
                self.wrap_view('dispatch_detail'),
                name="api_dispatch_detail"),
        ]

    class Meta:
        resource_name = 'pvp/talent-category-reports/all-employees'
        object_class = TalentCategoryReport
        allowed_methods = ['get']
        detail_uri_name = 'all_employees'

class TeamTalentCategoryReportResource(TalentCategoryReportResource):

    def obj_get(self, bundle, **kwargs):
        return get_most_recent_talent_category_report_for_team(64)

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/(?P<pk>\d+)$" % self._meta.resource_name,
                self.wrap_view('dispatch_detail'),
                name="api_dispatch_detail"),
        ]

    class Meta:
        resource_name = 'pvp/talent-category-reports/teams'
        object_class = TalentCategoryReport
        allowed_methods = ['get']
