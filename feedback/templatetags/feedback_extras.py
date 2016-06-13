from django import template
import string

register = template.Library()

@register.filter
def remove_beginning_slash(value):
    if value[0][0] == '/':
        return string.replace(value, '/', '', 1)
    else:
        return value
