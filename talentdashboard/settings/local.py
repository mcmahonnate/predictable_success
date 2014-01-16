# Local settings
from .base import *
DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', #postgresql_psycopg2
        'NAME': 'talentdashboard.db',
        'USER': 'djangotalentdashboard',
        'PASSWORD': 'F00lF00l!',
        'HOST': '127.0.0.1',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get("EMAIL_ADDRESS", '')
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD", '')

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
