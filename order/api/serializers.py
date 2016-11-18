from rest_framework import serializers
from ..models import *


class CouponSerializer(serializers.ModelSerializer):

    discounted_price = serializers.SerializerMethodField()

    def get_discounted_price(self, obj):
        view = self.context.get('view')
        request = self.context.get('request')
        amount = request.data['amount']
        discounted_price = view.get_discounted_price(amount=amount, coupon=obj)
        return discounted_price

    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discounted_price']

