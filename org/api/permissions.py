from rest_framework import permissions
from ..models import *


class PermissionsViewAllEmployees(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        else:
            return False


class PermissionsViewThisEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        else:
            pk = view.kwargs['pk']
            requester = Employee.objects.get(user=request.user)
            employee = Employee.objects.get(id=pk)
            has_permission = requester.is_ancestor_of(employee)
            if not has_permission and requester.id == employee.coach.id:
                has_permission = True
            return has_permission


class PermissionsViewThisEmployeeOrAllEmployees(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        else:
            employee = view.get_employee()
            requester = Employee.objects.get(user=request.user)
            has_permission = requester.is_ancestor_of(employee)
            if not has_permission and requester.id == employee.coach.id:
                has_permission = True
            return has_permission


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


class UserIsEmployeeOrLeaderOrCoachOfEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        else:
            requester = Employee.objects.get(user=request.user)
            employee = view.get_employee()
            has_permission = requester.is_ancestor_of(employee)
            if not has_permission and requester.id == employee.coach.id:
                has_permission = True
            elif not has_permission and requester.id == employee.id:
                has_permission = True
            return has_permission