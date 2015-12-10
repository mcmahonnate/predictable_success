from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^requests/$', CreateFeedbackRequest.as_view()),
    url(r'^requests/recently-sent/$', RecentFeedbackRequestsIveSentList.as_view()),
    url(r'^requests/(?P<pk>[0-9]*)/$', RetrieveFeedbackRequest.as_view()),
    url(r'^requests/todo/$', FeedbackRequestsToDoList.as_view(), name='todo-requests'),
    url(r'^submissions/$', CreateFeedbackSubmission.as_view()),
    url(r'^submissions/my/$', RetrieveMyFeedbackSubmissions.as_view()),
    url(r'^submissions/(?P<pk>[0-9]*)/helpful/$', EmployeeUpdateFeedbackSubmission.as_view()),
    url(r'^submissions/(?P<pk>[0-9]*)/summary/$', CoachUpdateFeedbackSubmission.as_view()),
    url(r'^submissions/(?P<pk>[0-9]*)/$', RetrieveFeedbackSubmission.as_view()),
    url(r'^potential-reviewers/$', PotentialReviewers.as_view(), name='potential-reviewers'),
    url(r'^reports/employees/$', employee_feedback_report),
    url(r'^reports/coachees/$', feedback_progress_reports),
    url(r'^reports/coachees/(?P<employee_id>[0-9]*)/$', feedback_progress_report),
    url(r'^coachees/(?P<employee_id>[0-9]*)/digests/current/submissions/$', AddRemoveDigestSubmission.as_view()),
    url(r'^coachees/(?P<employee_id>[0-9]*)/digests/current/$', RetrieveUpdateCurrentFeedbackDigest.as_view()),
    url(r'^my/digests/$', RetrieveMyFeedbackDigests.as_view()),
    url(r'^digests/delivered/$', RetrieveFeedbackDigestsIveDelivered.as_view()),
    url(r'^digests/(?P<pk>[0-9]*)/$', RetrieveFeedbackDigest.as_view()),
    url(r'^digests/(?P<pk>[0-9]*)/share/$', ShareFeedbackDigest.as_view()),
]
