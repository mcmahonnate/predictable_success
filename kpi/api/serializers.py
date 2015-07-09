from rest_framework import serializers
from ..models import Indicator, Performance


class KPIIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ('id', 'name')


class KPIPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performance
        fields = ('id', 'value', 'date')


