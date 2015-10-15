from django.core.management.base import BaseCommand, CommandError
from org.models import Employee, CoachCapacity
from ...models import FeedbackRequest, FeedbackSubmission

excels_at_answer = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta, sapien sit amet blandit tempor, dui leo porttitor arcu, eu consectetur dui purus non velit."
could_improve_on_answer = "Vestibulum accumsan leo vel viverra efficitur. Donec in velit id quam tempus suscipit. Nam et augue consequat, aliquet leo vel, vestibulum erat. Proin euismod id odio et placerat. Suspendisse potenti."
message_text = 'Donec in velit id quam tempus suscipit.'


class Command(BaseCommand):
    def handle(self, *args, **options):
        FeedbackRequest.objects.all().delete()
        FeedbackSubmission.objects.all().delete()
        username = raw_input("Enter your username: ")
        me = Employee.objects.filter(user__username=username).first()
        try:
            capacity = CoachCapacity.objects.get(employee=me)
            capacity.max_allowed_coachees += 5
            capacity.save()
        except CoachCapacity.DoesNotExist:
            pass

        employees = Employee.objects.exclude(pk=me.pk).all()[:5]
        for employee in employees:
            employee.coach = me
            employee.save()
        reviewers = employees[:3]
        unsolicited_reviewers = employees[3:]

        for subject in employees:
            FeedbackRequest(requester=subject, reviewer=me, message=message_text).save()

            for reviewer in reviewers:
                if subject == reviewer:
                    continue
                request = FeedbackRequest(requester=subject, reviewer=reviewer)
                request.save()
                submission = FeedbackSubmission(subject=subject, reviewer=reviewer)
                submission.excels_at = excels_at_answer
                submission.could_improve_on = could_improve_on_answer
                submission.feedback_request = request
                submission.save()

            for reviewer in unsolicited_reviewers:
                submission = FeedbackSubmission(subject=subject, reviewer=reviewer)
                submission.excels_at = excels_at_answer
                submission.could_improve_on = could_improve_on_answer
                submission.save()

        print "Your new coachees are:"
        for employee in employees:
            print "{0} {1}".format(employee.id, employee.full_name)
