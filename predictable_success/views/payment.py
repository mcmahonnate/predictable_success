import stripe

from django.conf import settings
from django.core.urlresolvers import reverse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from django.views.generic import TemplateView
from leadership_styles.models import TeamLeadershipStyle
from order.models import Coupon, Charge


class PaymentView(TemplateView):
    template = "payment.html"
    success_url = "index"
    fail_url = "payment"

    def get(self, request, **kwargs):
        return render_to_response(self.template, {
            'stripe_key': settings.STRIPE_PUBLISHABLE_KEY,
        }, context_instance=RequestContext(request))

    def post(self, request, *args, **kwargs):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        stripe_token = request.POST.get('stripeToken', '')
        stripe_email = request.POST.get('stripeEmail', '')
        code = request.POST.get('couponCode', '')
        coupon = None
        coupon_code = None
        if code:
            coupon = Coupon.objects.getCoupon(code=code)
            if coupon:
                coupon_code = coupon.code

        if not stripe_token:
            raise Exception('Missing stripeToken.')

        if not stripe_email:
            raise Exception('Missing stripeEmail.')

        try:
            customer = stripe.Customer.create(
                source=stripe_token,
                email=stripe_email
            )

            product_sku = settings.STRIPE_PRODUCT_SKU
            order = stripe.Order.create(
                currency='usd',
                items=[{
                    "type": 'sku',
                    "parent": product_sku,
                }],
                customer=customer,
                coupon=coupon_code
            )

            order.pay(customer=customer)
            charge = Charge(stripe_id=order.id, amount=order.amount, coupon=coupon)
            charge.save()
            team = TeamLeadershipStyle.objects.create_team(request.user.employee, customer_id=customer.id)

            return redirect("%s#/?team_id=%s&addMembers=true" % (reverse(self.success_url), team.id))
        except stripe.CardError, e:
            print('Card has been declined: %s' % e)
            pass
