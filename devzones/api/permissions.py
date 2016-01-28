from rest_framework import permissions


class UserIsEmployeeOfEmployeeZone(permissions.BasePermission):
    """ Ensures that the current user is either the employee of the EmployeeZone,
    has permission to view everyone's data, or is a leader of that employee
    the check-in.

    Any view that uses this permission needs to implement
    the get_employee_zone() method that should return the employee zone
    that the request is related to.
    """
    def has_permission(self, request, view):
        employee_zone = view.get_employee_zone()
        employee = employee_zone.employee
        if request.user.has_perm('org.view_employees'):
                return True
        elif request.user.employee.is_ancestor_of(employee):
                return True

        return request.user.employee == employee