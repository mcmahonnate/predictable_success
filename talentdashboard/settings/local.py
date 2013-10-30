# Local settings
from .base import *
DEBUG = True
TEMPLATE_DEBUG = DEBUG

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = '/vagrant/django-talentdashboard/talentdashboard/media/'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

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
