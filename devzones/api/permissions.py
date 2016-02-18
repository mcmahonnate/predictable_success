from rest_framework import permissions


class UserIsConversationParticipant(permissions.BasePermission):
    """ Ensures that the current user is a
    participant in the conversation.

    Any view that uses this permission needs to implement
    the get_converstaion() method that should return a Conversation
    object.
    """
    def has_permission(self, request, view):
        conversation = view.get_conversation()
        if request.user.employee in conversation.meeting.participants.all():
            return True
        return request.user.employee.id == conversation.development_lead.id


class UserIsAssessor(permissions.BasePermission):
    """ Ensures that the current user is a
    participant in the conversation.

    Any view that uses this permission needs to implement
    the get_employee_zone() method that should return a Conversation
    object.
    """
    def has_permission(self, request, view):
        employee_zone = view.get_employee_zone()
        return request.user.employee.id == employee_zone.assessor.id