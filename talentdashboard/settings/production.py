# Production settings
from .base import *
import dj_database_url

DATABASES['default'] = dj_database_url.config(default=os.environ.get('DATABASE_URL'))

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']