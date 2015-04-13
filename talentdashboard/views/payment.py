import stripe

from django.shortcuts import redirect, render_to_response
from django.conf import settings
from django.views.generic import TemplateView
from django.template import RequestContext

class ChargeView(TemplateView):
    success_url = "thanks.html"
    fail_url = "payment"
    
    def get(self, request, **kwargs):
        #return redirect(self.fail_url)
        return render_to_response(self.success_url, {}, context_instance=RequestContext(request))

    def post(self, request, *args, **kwargs):
        stripe_test_api_key = "sk_test_4seBLkeRNSVS4NAcRsTQb1MC"
        stripe_live_api_key = "sk_test_4seBLkeRNSVS4NAcRsTQb1MC"

        stripe.api_key = stripe_test_api_key
        token = request.POST.get('stripeToken', '')
        email = request.POST.get('stripeEmail', '')
        employees = request.POST.get('employees', '')
        plan = request.POST.get('plan', '')
        company = request.POST.get('company', '')
        total = request.POST.get('total', '')
        
        try:

            # Create a Customer
            customer = stripe.Customer.create(
                source=token,
                plan=plan,
                quantity=employees,
                description=company,
                email=email
            )

            return render_to_response(self.success_url, {
                'plan': plan,
                'employees': employees,
                'total': total,
                'email': email
            }, context_instance=RequestContext(request))


        except stripe.CardError, e:

          # The card has been declined
          pass
