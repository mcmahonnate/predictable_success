FeedbackRequest.objects.all().delete()
FeedbackSubmission.objects.all().delete()
username = raw_input("Enter your username: ")
me = Employee.objects.filter(user__username=username).first()
e1 = Employee.objects.get(pk=1541)
e2 = Employee.objects.get(pk=1540)
e3 = Employee.objects.get(pk=1539)
e4 = Employee.objects.get(pk=1538)
e5 = Employee.objects.get(pk=1537)
e1.coach = me
e1.save()
e2.coach = me
e2.save()
e3.coach = me
e3.save()
e4.coach = me
e4.save()
e5.coach = me
e5.save()
subjects = [e1, e2, e3, e4, e5]
reviewers = [e1, e2, e3, e4, e5]
for subject in subjects:
    FeedbackRequest(requester=subject, reviewer=me).save()

    submission = FeedbackSubmission(subject=me, reviewer=subject)
    submission.excels_at = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta, sapien sit amet blandit tempor, dui leo porttitor arcu, eu consectetur dui purus non velit."
    submission.could_improve_on = "Vestibulum accumsan leo vel viverra efficitur. Donec in velit id quam tempus suscipit. Nam et augue consequat, aliquet leo vel, vestibulum erat. Proin euismod id odio et placerat. Suspendisse potenti."
    submission.has_been_delivered = True
    submission.save()

    for reviewer in reviewers:
        if subject == reviewer:
            continue
        request = FeedbackRequest(requester=subject, reviewer=reviewer)
        request.save()
        submission = FeedbackSubmission(subject=subject, reviewer=reviewer)
        submission.excels_at = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta, sapien sit amet blandit tempor, dui leo porttitor arcu, eu consectetur dui purus non velit."
        submission.could_improve_on = "Vestibulum accumsan leo vel viverra efficitur. Donec in velit id quam tempus suscipit. Nam et augue consequat, aliquet leo vel, vestibulum erat. Proin euismod id odio et placerat. Suspendisse potenti."
        submission.feedback_request = request
        submission.save()
