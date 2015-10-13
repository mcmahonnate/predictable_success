from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^requests/$', CreateFeedbackRequest.as_view()),
    url(r'^requests/(?P<pk>[0-9]*)/$', RetrieveFeedbackRequest.as_view()),
    url(r'^submissions/$', CreateFeedbackSubmission.as_view()),
    url(r'^potential-reviewers/$', PotentialReviewers.as_view(), name='potential-reviewers'),
    url(r'^coachees/(?P<pk>[0-9]*)/report/$', coachee_feedback_report),
]
