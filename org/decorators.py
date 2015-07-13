from models import Employee


def add_current_employee_id_to_request(field_name):
    def decorator(a_view):
        def wrapped(request, *args, **kwargs):
            employee = Employee.objects.get_from_user(request.user)
            has_multiple_items = isinstance(request.DATA, list)
            if has_multiple_items:
                for item in request.DATA:
                    item[field_name] = employee.id
            else:
                request.DATA[field_name] = employee.id
            return a_view(request, *args, **kwargs)
        return wrapped
    return decorator
