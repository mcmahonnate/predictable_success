from functools import wraps
from django.views.decorators.cache import cache_page
from django.utils.decorators import available_attrs
from django.contrib.auth.decorators import user_passes_test
from django.utils.log import getLogger

logger = getLogger('talentdashboard')

def cache_on_auth(timeout, *group_names):
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            u = request.user
            if u.is_authenticated():
                if u.groups.filter(name__in=group_names).exists() | u.is_superuser:
                    return cache_page(timeout)(view_func)(request, *args, **kwargs)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator
    
def group_required(*group_names):
    """Requires user membership in at least one of the groups passed in."""
    def in_groups(u):
        if u.is_authenticated():
            if u.groups.filter(name__in=group_names).exists() | u.is_superuser:
                return True
        return False
    return user_passes_test(in_groups)