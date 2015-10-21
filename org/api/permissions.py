from rest_framework import permissions


class UserIsCoachOfEmployee(permissions.BasePermission):
    """ Ensures that the current user is the coach of
    the employee that the request is related to.

    Any view that uses this permission needs to implement
    the get_employee() method that should return the employee
    that the request is related to.
    """
    def has_permission(self, request, view):
        employee = view.get_employee()
        return request.user.employee == employee.coach
