from rest_framework import permissions


class UserIsSubjectOrReviewerOrCoach(permissions.BasePermission):
    """ Ensures that the current user is teh feedback reviewer the request is related to, or the employee themselves.

    Any view that uses this permission needs to implement
    the get_submission() method that should return the submission
    that the request is related to.
    """
    def has_permission(self, request, view):
        submission = view.get_submission()
        employee = submission.subject
        if request.user.employee == employee:
            return submission.has_been_delivered
        else:
            return request.user.employee == employee.coach or request.user.employee == submission.reviewer


class UserIsEmployeeOrDigestDeliverer(permissions.BasePermission):
    """ Ensures that the current user is either the subject or deliverer of
    the feedback digest.

    Any view that uses this permission needs to implement
    the get_digest() method that should return the employee
    that the request is related to.
    """
    def has_permission(self, request, view):
        digest = view.get_digest()
        employee = digest.subject
        delivered_by = digest.delivered_by
        if request.user.employee == employee:
            return digest.has_been_delivered
        else:
            return request.user.employee == delivered_by