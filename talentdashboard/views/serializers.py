from rest_framework import serializers
from django.utils.log import getLogger
logger = getLogger('talentdashboard')


class TalentCategoryReportSerializer(serializers.Serializer):
    evaluation_date = serializers.DateField()
    categories = serializers.DictField()
    total_evaluations = serializers.IntegerField()


class SalaryReportSerializer(serializers.Serializer):
    categories = serializers.SerializerMethodField()
    total_salaries = serializers.SerializerMethodField()

    def get_categories(self, obj):
        cats = {}
        for key in obj.categories:
            cats[key] = float(obj.categories[key])
        return cats

    def get_total_salaries(self, obj):
        return float(obj.total_salaries)


class IdSerializer(serializers.Serializer):
    id = serializers.IntegerField()