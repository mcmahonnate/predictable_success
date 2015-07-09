from rest_framework import serializers
from ..models import CompensationSummary


class CompensationSummarySerializer(serializers.ModelSerializer):
    total_compensation = serializers.SerializerMethodField()
    salary = serializers.SerializerMethodField()
    bonus = serializers.SerializerMethodField()
    discretionary = serializers.SerializerMethodField()
    writer_payments_and_royalties = serializers.SerializerMethodField()

    def get_salary(self, obj):
        return float(obj.salary)

    def get_bonus(self, obj):
        return float(obj.bonus)

    def get_discretionary(self, obj):
        return float(obj.discretionary)

    def get_writer_payments_and_royalties(self, obj):
        return float(obj.writer_payments_and_royalties)

    def get_total_compensation(self, obj):
        return float(obj.get_total_compensation())

    class Meta:
        model = CompensationSummary
        fields = ('year', 'salary', 'bonus', 'discretionary', 'writer_payments_and_royalties', 'total_compensation')


