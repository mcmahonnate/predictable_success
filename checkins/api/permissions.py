from rest_framework import permissions


class UserIsRequesterOfCheckInRequest(permissions.BasePermission):
    """ Ensures that the current user is the requester of
    the check-in request.

    Any view that uses this permission needs to implement
    the get_checkin_request() method that should return the check-in
    that the request is related to.
    """
    def has_permission(self, request, view):
        checkin_request = view.get_checkin_request()
        requester = checkin_request.requester
        return request.user.employee == requester


class UserIsEmployeeOrHostOfCheckIn(permissions.BasePermission):
    """ Ensures that the current user is either the employee or host of
    the check-in.

    Any view that uses this permission needs to implement
    the get_checkin() method that should return the check-in
    that the request is related to.
    """
    def has_permission(self, request, view):
        checkin = view.get_checkin()
        employee = checkin.employee
        if (not request.tenant.show_shareable_checkins):
            if request.user.has_perm('org.view_employees'):
                return True
            elif (request.user.employee.is_ancestor_of(employee) or checkin.host == employee):
                return True
            else:
                return False

        if (request.tenant.show_shareable_checkins and request.user.employee.is_ancestor_of(employee)):
            return True
        host = checkin.host
        can_show_checkin = (request.tenant.show_shareable_checkins and checkin.visible_to_employee)
        return request.user.employee == host or (request.user.employee == employee and can_show_checkin)


class UserIsHostOfCheckIn(permissions.BasePermission):
    """ Ensures that the current user is the host of
    the check-in.

    Any view that uses this permission needs to implement
    the get_checkin() method that should return the check-in
    that the request is related to.
    """
    def has_permission(self, request, view):
        checkin = view.get_checkin()
        host = checkin.host
        return request.tenant.show_shareable_checkins and request.user.employee == host


class UserIsEmployeeOfCheckIn(permissions.BasePermission):
    """ Ensures that the current user is the employee of
    the check-in.

    Any view that uses this permission needs to implement
    the get_checkin() method that should return the check-in
    that the request is related to.
    """
    def has_permission(self, request, view):
        checkin = view.get_checkin()
        employee = checkin.employee
        return request.tenant.show_shareable_checkins and request.user.employee == employee


class UserCanSeeCheckInConversation(permissions.BasePermission):
    """ Ensures that the current user is allowed to see the Check-In conversation.

    Any view that uses this permission needs to implement
    the get_checkin() method that should return the check-in
    that the request is related to.
    """
    def has_permission(self, request, view):
        checkin = view.get_checkin()
        employee = checkin.employee
        host = checkin.host
        is_team_lead = request.user.employee.is_ancestor_of(employee)
        is_employee = (request.user.employee == employee)
        is_host = (request.user.employee == host)
        has_all_access = request.user.has_perm('org.view_employees')
        if request.tenant.show_shareable_checkins:
            can_show_checkin = checkin.published
        else:
            can_show_checkin = True
        return can_show_checkin and (is_team_lead or is_employee or is_host or has_all_access)


class CheckInsAreShareable(permissions.BasePermission):
    """ Check to make sure Checkins are shareable."""
    def has_permission(self, request, view):
        return request.tenant.show_shareable_checkins