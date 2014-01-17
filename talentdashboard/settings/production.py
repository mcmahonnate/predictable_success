# Production settings
from .base import *
import dj_database_url

DATABASES = { 'default': dj_database_url.config(default=os.environ.get('DATABASE_URL')) }

EMAIL_BACKEND = 'talentdashboard.backend.SSLEmailBackend'
EMAIL_USE_SSL = True
EMAIL_HOST = 'mail.dfrntlabs.com'
EMAIL_PORT = 465
EMAIL_HOST_USER = os.environ.get("EMAIL_ADDRESS", '')
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD", '')
DEFAULT_FROM_EMAIL = 'Talent Dashboard Team <' + EMAIL_HOST_USER + '>'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']