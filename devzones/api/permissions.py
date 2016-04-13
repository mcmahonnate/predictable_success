from rest_framework import permissions


class UserIsMeetingParticipantOrHasAllAccess(permissions.BasePermission):
    """ Ensures that the current user is a
    participant in the meeting.

    Any view that uses this permission needs to implement
    the get_meeting() method that should return a Meeting
    object.
    """
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        meeting = view.get_meeting()
        return request.user.employee in meeting.participants.all()


class UserIsConversationParticipantOrHasAllAccess(permissions.BasePermission):
    """ Ensures that the current user is a
    participant in the conversation.

    Any view that uses this permission needs to implement
    the get_converstaion() method that should return a Conversation
    object.
    """
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        conversation = view.get_conversation()
        if request.user.employee in conversation.meeting.participants.all():
            return True
        return request.user.employee.id == conversation.development_lead.id


class UserIsConversationParticipantOrHasAllAccessOrIsEmployee(permissions.BasePermission):
    """ Ensures that the current user is a
    participant in the conversation.

    Any view that uses this permission needs to implement
    the get_converstaion() method that should return a Conversation
    object.
    """
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        conversation = view.get_conversation()
        if request.user.employee in conversation.meeting.participants.all():
            return True
        if request.user.employee.id == conversation.employee.id:
            return True
        return request.user.employee.id == conversation.development_lead.id


class UserIsAssessor(permissions.BasePermission):
    """ Ensures that the current user is the assessor
    of the EmployeeZone.

    Any view that uses this permission needs to implement
    the get_employee_zone() method that should return a Conversation
    object.
    """
    def has_permission(self, request, view):
        employee_zone = view.get_employee_zone()
        return request.user.employee.id == employee_zone.assessor.id


class UserIsAssessorOrHasAllAccess(permissions.BasePermission):
    """ Ensures that the current user is the assessor
    of the EmployeeZone or has all access.

    Any view that uses this permission needs to implement
    the get_employee_zone() method that should return a Conversation
    object.
    """
    def has_permission(self, request, view):
        employee_zone = view.get_employee_zone()
        if request.user.has_perm('org.view_employees') and employee_zone.assessor.id != employee_zone.employee.id:
            return True
        return request.user.employee.id == employee_zone.assessor.id