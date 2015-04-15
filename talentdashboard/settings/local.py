# Local settings
from .base import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

COMPRESS_OFFLINE = True
COMPRESS_PRECOMPILERS = ()

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

CELERY_ALWAYS_EAGER = True

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_USE_SSL = True
EMAIL_HOST = 'mail.dfrntlabs.com'
EMAIL_PORT = 465
EMAIL_HOST_USER = os.environ.get("EMAIL_ADDRESS", '')
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD", '')
DEFAULT_FROM_EMAIL = 'Dash Team <' + EMAIL_HOST_USER + '>'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
            'formatter': 'simple'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'talentdashboard': {
            'handlers': ['file'],
            'level': 'DEBUG',
        },
        'pvp': {
            'handlers': ['file'],
            'level': 'DEBUG',
        },
    }
}
