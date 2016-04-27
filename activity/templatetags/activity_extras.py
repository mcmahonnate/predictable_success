from django import template

register = template.Library()

@register.filter
def get_description(event, user):
    return event.description(user)
