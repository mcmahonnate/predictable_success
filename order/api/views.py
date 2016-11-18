from rest_framework.generics import GenericAPIView, Http404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import *
from order.models import Coupon


class ApplyCoupon(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CouponSerializer

    def put(self, request, format=None):
        amount = request.data['amount']
        code = request.data['code']
        if amount > 0 and code:
            coupon = Coupon.objects.getCoupon(code)
            if coupon:
                serializer = self.get_serializer(coupon, context={'request': request})
                return Response(serializer.data)
        raise Http404()

    def get_discounted_price(self, amount, coupon):
        return coupon.apply_discount(amount)
