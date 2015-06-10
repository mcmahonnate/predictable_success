from django.conf import settings
from django.shortcuts import redirect, render_to_response
from insights.models import Employee
from insights.forms import SignupForm, ReportForm, SurveyForm
from django.views.generic.edit import FormView, CreateView
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.template import RequestContext

class Signup(CreateView):
    model = Employee
    template_name = 'insights/signup.html'
    form_class = SignupForm

    def form_valid(self, form):
        return super(Signup, self).form_valid(form) 


class Report(FormView):
    model = Employee
    template = 'insights/report.html'

    def get(self, request, **kwargs):
        url = self.request.META['HTTP_HOST'] +'/insights/survey/'+ self.kwargs['access_token']
        responses =  Employee.objects.filter(access_token=self.kwargs['access_token']).exclude(team_lead=True).order_by('-created_at')
        team_leads =  Employee.objects.filter(access_token=self.kwargs['access_token']).filter(team_lead=True)
        threshold = 2

        for team_lead in team_leads:
            company = team_lead.company

        return render_to_response(self.template, {
            'url': url,
            'company': company,
            'responses': responses,
            'threshold': threshold,
        }, context_instance=RequestContext(request)) 



class Survey(FormView):
    model = Employee
    template = 'insights/survey.html'
    form = SurveyForm
    success_url = '/insights/thanks'

    def post(self, request, *args, **kwargs):
        form = SurveyForm(request.POST)
        team_lead =  Employee.objects.filter(access_token=self.kwargs['access_token']).filter(team_lead=True)
        
        if form.is_valid():
            f = form.save(commit=False)
            f.access_token = kwargs.get('access_token', '') 
            f.save()
            return HttpResponseRedirect('/insights/thanks/')
        return render_to_response(self.template, {
            'form': form,
            'team_lead': team_lead
        })    

    # def form_valid(self, form):
    #     return super(Survey, self).form_valid(form) 

    def get(self, request, **kwargs):
        team_lead =  Employee.objects.filter(access_token=self.kwargs['access_token']).filter(team_lead=True)
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
              