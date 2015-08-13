from django import template

register = template.Library()

@register.filter
def get_summary(checkin, user):
    return checkin.get_summary(user)