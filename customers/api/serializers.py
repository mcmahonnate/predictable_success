from django.conf import settings
from rest_framework import serializers
from ..models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    support_email = serializers.SerializerMethodField()

    def get_support_email(self, obj):
        return settings.SUPPORT_EMAIL_ADDRESS

    class Meta:
        model = Customer
        fields = ('id', 'name', 'domain_url', 'order_page_enabled', 'show_individual_comp', 'show_qualities', 'support_email')

