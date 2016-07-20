from django import template
from django.utils.timesince import timeuntil
import string

register = template.Library()


@register.filter
def remove_beginning_slash(value):
    if value[0][0] == '/':
        return string.replace(value, '/', '', 1)
    else:
        return value


@register.filter
def time_since(value):
    return '%(time)s' % {'time': timeuntil(value)}