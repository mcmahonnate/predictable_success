from django.shortcuts import render_to_response
from insights.models import Prospect
from insights.forms import SignupForm, SurveyForm
from django.views.generic.edit import FormView, CreateView
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect, Http404
from django.template import RequestContext


class Signup(CreateView):
    model = Prospect
    template_name = 'insights/signup.html'
    form_class = SignupForm

    def get_form_kwargs(self):
        kwargs = super(Signup, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

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
        team_lead = Prospect.objects.filter(access_token=self.kwargs['access_token']).filter(team_lead=True)
        
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
        try:
            lead = Prospect.objects.filter(access_token=self.kwargs['access_token']).filter(team_lead=True).first()
            form = SurveyForm()

            return render_to_response(self.template, {
                'lead': lead,
                'form': form,
            }, context_instance=RequestContext(request))
        except Prospect.DoesNotExist:
            return Http404()


class Confirmation(TemplateView):
    template = "insights/thanks.html"

    def get(self, request, **kwargs):
        return render_to_response(self.template, {}, context_instance=RequestContext(request))
