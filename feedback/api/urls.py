from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^requests/$', CreateFeedbackRequest.as_view()),
    url(r'^requests/pending/$', FeedbackRequestsThatHaventBeenRespondedTo.as_view(), name='pending-requests'),
    url(r'^requests/todo/$', FeedbackRequestsToDoList.as_view(), name='todo-requests'),
    url(r'^potential-reviewers/$', PotentialReviewers.as_view(), name='potential-reviewers'),
]
