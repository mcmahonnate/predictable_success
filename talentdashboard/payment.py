import stripe

from django.shortcuts import render
from django.conf import settings
from django.views.generic import TemplateView

class ChargeView(TemplateView):
    template = "charge.html"
    
    def get(self, request, **kwargs):
        return render(request, self.template, {})

    def post(self, request, *args, **kwargs):
        stripe_test_api_key = "sk_test_4seBLkeRNSVS4NAcRsTQb1MC"

        stripe.api_key = stripe_test_api_key
        token = request.POST.get('stripeToken', '')
        email = request.POST.get('stripeEmail', '')
        employees = request.POST.get('employees', '')
        plan = request.POST.get('plan', '')
        company = request.POST.get('company', '')
        
        try:

          # Create a Customer
          customer = stripe.Customer.create(
            source=token,
            plan=plan,
            quantity=employees,
            description=company,
            email=email
          )

          return render(request, self.template, {})

        except stripe.CardError, e:

          # The card has been declined
          pass
