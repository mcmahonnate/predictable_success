# Django settings for predictable_success project.
import os.path
import dj_database_url
import raven

SITE_ID=1

SITE_PROTOCOL = os.environ.get("SITE_PROTOCOL", 'http://')
SITE_PORT = os.environ.get("SITE_PORT", None)
SECRET_KEY = os.environ['SECRET_KEY']
TEMPLATE_DEBUG = DEBUG = os.environ.get("DEBUG", False)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
TEST_RUNNER = 'django.test.runner.DiscoverRunner'

# Database settings
DATABASES = { 'default': dj_database_url.config(default=os.environ.get('DATABASE_URL')) }
DATABASES['default']['ENGINE'] = 'tenant_schemas.postgresql_backend'
DATABASE_ROUTERS = (
    'tenant_schemas.routers.TenantSyncRouter',
)

#Gravatar API
GRAVATAR_PROFILE = 'https://www.gravatar.com/'
GRAVATAR_IMAGE = 'https://www.gravatar.com/avatar/'

# Celery settings
CELERY_ALWAYS_EAGER = False
CELERY_TIMEZONE = 'America/New_York'

#RabbitMQ settings
BROKER_URL = os.environ['RABBITMQ_BIGWIG_URL']

MANAGERS = ADMINS = (
    ('Nate McMahon', 'nmcmahon@fool.com'),
)

REQUIRED_GROUPS = (
    'AllAccess',
    'CoachAccess',
    'Daily Digest Subscribers',
    'Edit Employee',
    'TeamLeadAccess',
    'View Comments',
)

SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# Email settings
EMAIL_USE_SSL = True
EMAIL_HOST = os.environ.get("EMAIL_HOST", '')
EMAIL_PORT = os.environ.get("EMAIL_PORT", '')
EMAIL_HOST_USER = os.environ.get("EMAIL_USER", '')
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD", '')
EMAIL_SENDING_DOMAIN = os.environ.get("EMAIL_SENDING_DOMAIN", '')
SUPPORT_EMAIL_ADDRESS = 'support@' + EMAIL_SENDING_DOMAIN
DEFAULT_FROM_EMAIL = 'The Synergizer Team <' + SUPPORT_EMAIL_ADDRESS + '>'
DEMO_REQUEST_EMAIL_TO = 'nate@fool.com'
DEMO_REQUEST_EMAIL_SUBJECT = ' requested a demo'

ALLOWED_HOSTS = ['.synergizer-sandbox.com', 'live-predictable-success.herokuapp.com', 'staging-predictable-success.herokuapp.com']
INTERNAL_IPS = (
    '0.0.0.0',
    '127.0.0.1',
)
TIME_ZONE = 'America/New_York'
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Media settings
MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'media')
MEDIA_URL = '/media/'

# Static settings
# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'staticfiles')
STATIC_URL = '/static/'
# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static'),
)
# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

# Compress settings
COMPRESS_URL = STATIC_URL
COMPRESS_ROOT = STATIC_ROOT
COMPRESS_ENABLED = os.environ.get("COMPRESS_ENABLED", False)
COMPRESS_OFFLINE = os.environ.get("COMPRESS_OFFLINE", False)
COMPRESS_PRECOMPILERS = (
    ('text/less', '%s {infile} {outfile}' % (os.path.join(BASE_DIR, 'node_modules/less/bin/lessc'), )),
)
COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.SlimItFilter',
]
COMPRESS_CSS_HASHING_METHOD = 'content'

# AWS Settings
AWS_STORAGE_BUCKET_NAME = os.environ['AWS_STORAGE_BUCKET_NAME']
AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
AWS_QUERYSTRING_AUTH = False
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
S3_URL = 'http://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME

# Stripe settings
STRIPE_PUBLISHABLE_KEY = os.environ['STRIPE_PUBLISHABLE_KEY']
STRIPE_SECRET_KEY = os.environ['STRIPE_SECRET_KEY']
STRIPE_PRODUCT_SKU = os.environ.get('STRIPE_PRODUCT_SKU', 'sku_9C3P7b1Qa3KjtV')

# Solr settings
EMPLOYEES_SOLR_URL = os.environ['EMPLOYEES_SOLR_URL']
WEBSOLR_SECRET = os.environ['WEBSOLR_SECRET']

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

TEMPLATE_DIRS = (
    "/leadership_styles/templates",
    "/predictable_success/templates",
)

AUTHENTICATION_BACKENDS = (
    'predictable_success.backend.EmailOrUsernameModelBackend',
    'django.contrib.auth.backends.ModelBackend'
)

MIDDLEWARE_CLASSES = (
    'predictable_success.middleware.SSLRedirect',
    'tenant_schemas.middleware.TenantMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

SSLIFY_DISABLE = os.environ.get('SSLIFY_DISABLE', False)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ROOT_URLCONF = 'predictable_success.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'predictable_success.wsgi.application'

SHARED_APPS = (
    'tenant_schemas',  # mandatory
    'customers',
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.staticfiles',
    'static_precompiler',
    'compressor',
    'raven.contrib.django.raven_compat',
    'test_without_migrations',
)

TENANT_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.sites',
    'django.contrib.admin',
    'django_extensions',
    'rest_framework',
    'activity',
    'blah',
    'comp',
    'org',
    'mptt',
    'leadership_styles',
    'predictable_success',
    'preferences',
    'storages',
    'search',
    'sign_in',
    'qualities',
)

INSTALLED_APPS = list(set(SHARED_APPS + TENANT_APPS))

TENANT_MODEL = "customers.Customer"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
#    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
#    'PAGE_SIZE': 5,
    # Return native `Date` and `Time` objects in `serializer.data`
    'DATETIME_FORMAT': None,
    'DATE_FORMAT': None,
    'TIME_FORMAT': None,
}

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

LOGIN_URL = '/account/login'

def get_cache():
    import os
    try:
        os.environ['MEMCACHE_SERVERS'] = os.environ['MEMCACHIER_SERVERS'].replace(',', ';')
        os.environ['MEMCACHE_USERNAME'] = os.environ['MEMCACHIER_USERNAME']
        os.environ['MEMCACHE_PASSWORD'] = os.environ['MEMCACHIER_PASSWORD']
        return {
            'default': {
                'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
                'TIMEOUT': 500,
                'BINARY': True,
                'OPTIONS': { 'tcp_nodelay': True }
            }
        }
    except:
        return {
            'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
            }
        }
CACHES = get_cache()


FEEDBACK_APP_SETTINGS = {
    'respond_to_feedback_request_url_template': '{scheme}://{host}/feedback/#/todo/{id}'
}

if os.environ.get("HEROKU_APP_NAME", False):
    import heroku
    api = heroku.from_key(os.environ['HEROKU_API_KEY'])
    app = api.apps[os.environ.get("HEROKU_APP_NAME")]
    release = app.releases[-1]
    os.environ['HEROKU_RELEASE_NAME'] = release.name

RAVEN_CONFIG = {
    'dsn': 'https://f1a18dde65b54d21978a126d6f6e907c:3a723d634f8a45629cfbba4034bce984@app.getsentry.com/42421',
    'release': os.environ.get('HEROKU_RELEASE_NAME', None),
    'tags': {},
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'WARNING',
        'handlers': ['sentry', 'console'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(module)s %(message)s'
        },
    },
    'handlers': {
        'sentry': {
            'level': 'ERROR',
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['console'],
            'propagate': False,
        },
        'raven': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        },
        'sentry.errors': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        },
    },
}

