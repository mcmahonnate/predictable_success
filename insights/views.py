from django.conf import settings
from django.shortcuts import redirect, render_to_response
from insights.models import Prospect
from insights.forms import SignupForm, ReportForm, SurveyForm
from django.views.generic.edit import FormView, CreateView
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.core.mail import send_mail
#from django.core.mail import EmailMultiAlternatives

class Signup(CreateView):
    model = Prospect
    template_name = 'insights/signup.html'
    form_class = SignupForm

    def form_valid(self, form):
        return super(Signup, self).form_valid(form) 


class Report(FormView):
    model = Prospect
    template = 'insights/dashboard.html'

    def get(self, request, **kwargs):
        threshold = 2
        url = self.request.META['HTTP_HOST'] +'/insights/survey/'+ self.kwargs['access_token'] #get the query token and build survey link 
        responses =  Prospect.objects.filter(access_token=self.kwargs['access_token']).exclude(team_lead=True).order_by('-created_at')

        category_counts = {1:0,2:0,3:0,4:0,5:0,6:0}
        for prospect in responses:
            talent_category = prospect.talent_category 

            if talent_category in category_counts:
                category_counts[talent_category] += 1

            else:
                category_counts[talent_category] = 1     


        return render_to_response(self.template, {
            'url': url,
            'category_counts': category_counts,
            'responses': responses,
            'threshold': threshold,
        }, context_instance=RequestContext(request)) 



class Survey(FormView):
    model = Prospect
    template = 'insights/survey.html'
    form = SurveyForm
    success_url = '/insights/thanks'

    def post(self, request, *args, **kwargs):
        form = SurveyForm(request.POST)
        team_lead =  Prospect.objects.filter(access_token=self.kwargs['access_token']).filter(team_lead=True)
        
        if form.is_valid():
            f = form.save(commit=False)
            f.access_token = kwargs.get('access_token', '') 
            f.save()
            return HttpResponseRedirect('/insights/thanks/')
        return render_to_response(self.template, {
            'form': form,
            'team_lead': team_lead
        }, context_instance=RequestContext(request))


    def get(self, request, **kwargs):
        team_lead =  Prospect.objects.filter(access_token=self.kwargs['access_token']).filter(team_lead=True)
        form = SurveyForm()

        for lead in team_lead:
            lead = lead

        return render_to_response(self.template, {
            'lead': lead,
            'form': form,
        }, context_instance=RequestContext(request)) 



class Confirmation(TemplateView):
   template = "insights/thanks.html"

   def get(self, request, **kwargs):
       return render_to_response(self.template, {}, context_instance=RequestContext(request))    
              