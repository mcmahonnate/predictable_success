# Production settings
from .base import *
import dj_database_url

DATABASES = { 'default': dj_database_url.config(default=os.environ.get('DATABASE_URL')) }

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get("EMAIL_ADDRESS", '')
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD", '')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']