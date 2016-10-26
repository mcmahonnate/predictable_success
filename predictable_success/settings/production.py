# Production environment settings
from .base import *

RAVEN_CONFIG['tags']['environment'] = 'production'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
