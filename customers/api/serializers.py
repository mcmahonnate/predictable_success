from rest_framework import serializers
from ..models import Customer


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ('id', 'name', 'domain_url', 'order_page_enabled', 'show_individual_comp', 'show_qualities')

