from django.conf import settings
from django.conf.urls import *
from django.contrib import admin
from django.contrib.auth.views import password_reset, password_reset_confirm, password_reset_done, password_reset_complete, login, logout
from django.views.decorators.cache import cache_page
from django.views.generic.base import TemplateView
from forms import *
from org.api.views import EmployeeDetail, account_activate, account_activate_login
from rest_framework import routers
from views.homepage import IndexView
from views.payment import ChargeView, PaymentView
from views.views import *


router = routers.DefaultRouter()
router.register(r'^api/v1/teams', TeamViewSet)
router.register(r'^api/v1/leaderships', LeadershipsViewSet)
router.register(r'^api/v1/attributes', AttributeViewSet)

admin.autodiscover()

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^404/?$', TemplateView.as_view(template_name="404.html"), name='404'),
    url(r'^error/?$', TemplateView.as_view(template_name="error.html"), name='error'),
    url(r'^feedback/$', TemplateView.as_view(template_name="feedback.html"), name='feedback_home'),
    url(r'^logout/$', logout,{'next_page': '/account/login/'}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^org/chart/$', 'org.api.views.show_org_chart'),
    url(r'^account/activate/login/(?P<uidb64>[0-9A-Za-z]+)/$', account_activate_login, {'template_name': 'activation/activate_account_login.html', 'authentication_form': AuthenticationForm}, name='account_activate_login'),
    url(r'^account/activate/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)/$', account_activate, {'template_name': 'activation/activate_account.html', 'set_password_form': CustomSetPasswordForm}, name='account_activate'),
    url(r'^account/payment/?$', PaymentView.as_view(), name='payment'),
    url(r'^account/thanks/?$', ChargeView.as_view(), name='charge'),
    url(r'^account/login/?$', login,{'template_name':'login.html', 'authentication_form':CustomAuthenticationForm}, name='login'),
    url(r'^account/password_reset/done/$', password_reset_done, {'template_name': 'password_reset_done.html'}),
    url(r'^account/reset/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)/$', password_reset_confirm, {'template_name': 'password_reset_confirm.html', 'set_password_form': CustomSetPasswordForm}),
    url(r'^account/reset/complete/$', password_reset_complete, {'template_name': 'password_reset_complete.html'}),
    url(r'^account/reset/done/$', password_reset_complete, {'template_name': 'password_reset_complete.html'}),
    url(r'^account/', include('django.contrib.auth.urls')),
    url(r'^accounts/password/reset/$', password_reset, {'is_admin_site': True, 'template_name': 'password_reset_form.html', 'email_template_name': 'password_reset_email.html'}),

    url(r'^api/v1/image-upload/employees/(?P<pk>[0-9]+)/$', ImageUploadView.as_view()),
    url(r'^api/v1/import-data/employee$', upload_employee),
    url(r'^api/v1/import-data/leadership$', upload_leadership),
    url(r'^api/v1/import-data/teams$', upload_teams),

    url(r'^api/v1/reports/comments$', comment_report_timespan),
    url(r'^api/v1/reports/activity$', last_activity_report),

    url(r'^', include('leadership_styles.urls')),
    url(r'^api/v1/customer/', include('customers.api.urls')),
    url(r'^api/v1/comments/', include('blah.api.urls')),
    url(r'^api/v1/compensation/', include('comp.api.urls')),
    url(r'^api/v1/events/', include('activity.api.urls')),
    url(r'^api/v1/leadership-style/', include('leadership_styles.api.urls')),
    url(r'^api/v1/org/', include('org.api.urls')),
    url(r'^api/v1/qualities/', include('qualities.api.urls')),
    url(r'^api/v1/search/', include('search.api.urls')),


    url(r'^', include(router.urls)),
]
