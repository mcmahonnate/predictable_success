from rest_framework import permissions


class UserIsEmployee(permissions.BasePermission):
    """ Ensures that the current user is the
    employee that the request is related to.

    Any view that uses this permission needs to implement
    the get_employee() method that should return the employee
    that the request is related to.
    """
    def has_permission(self, request, view):
        employee = view.get_employee()
        return request.user.employee == employee


class UserIsEmployeesCoach(permissions.BasePermission):
    """ Ensures that the current user is the coach of
    the employee that the request is related to.

    Any view that uses this permission needs to implement
    the get_employee() method that should return the employee
    that the request is related to.
    """
    def has_permission(self, request, view):
        employee = view.get_employee()
        return request.user.employee == employee.coach


class UserIsEmployeeOrCoachOfEmployee(permissions.BasePermission):
    """ Ensures that the current user is either the coach of
    the employee that the request is related to, or the employee themselves.

    Any view that uses this permission needs to implement
    the get_employee() method that should return the employee
    that the request is related to.
    """
    def has_permission(self, request, view):
        employee = view.get_employee()
        return request.user.employee == employee.coach or request.user.employee == employee
