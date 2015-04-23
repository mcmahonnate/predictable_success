# Staging environment settings
from .base import *

RAVEN_CONFIG['tags']['environment'] = 'staging'
