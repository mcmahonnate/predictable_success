from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^apply-coupon/$', ApplyCoupon.as_view()),
]
