# Production environment settings
from .base import *

RAVEN_CONFIG['tags']['environment'] = 'production'
EMAIL_BACKEND = 'talentdashboard.backend.SSLEmailBackend'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
