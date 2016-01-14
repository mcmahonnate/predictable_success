from __future__ import absolute_import
from talentdashboard.celery import app
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q
from django.template import Context
from django.template.loader import get_template, render_to_string
from org.models import Employee
from checkins.models import CheckIn
from customers.models import current_customer
from .models import Comment


@app.task
def send_comment_reply_notification(comment_id):
    reply = Comment.objects.get(id=comment_id)
    parent_comment = Comment.objects.get(id=reply.object_id)
    employee_content_type = ContentType.objects.get_for_model(Employee)
    checkin_content_type = ContentType.objects.get_for_model(CheckIn)

    if parent_comment.content_type == employee_content_type:
        employee = Employee.objects.get(pk=parent_comment.object_id)
    elif parent_comment.content_type == checkin_content_type:
        checkin = CheckIn.objects.get(pk=parent_comment.object_id)
        employee = checkin.employee
    else:
        employee = None
    original_commenter = Employee.objects.get(user__id=parent_comment.owner_id)
    sub_commenters = Comment.objects.get_for_object(parent_comment)
    sub_commenters = sub_commenters.values('owner_id')
    mail_to = User.objects.filter(id__in=sub_commenters, is_active=True)
    mail_to = mail_to.exclude(id=reply.owner.id)
    mail_to = list(mail_to.values_list('email', flat=True))

    if original_commenter.user is not None \
            and original_commenter.user.is_active \
            and original_commenter.user.email is not None:
        if len(mail_to) > 0:
            mail_to.append(original_commenter.user.email)
        else:
            mail_to = [original_commenter.user.email]

    if len(mail_to) > 0:
        html_template = get_template('reply_notification.html')
        sub_commenter = Employee.objects.get(user__id=reply.owner.id)
        comment_content = parent_comment.content
        sub_comment_content = reply.content
        employee_name = employee.full_name
        commenter_avatar = original_commenter.avatar_small.url
        commenter_full_name = original_commenter.full_name
        sub_commenter_avatar = sub_commenter.avatar_small.url
        sub_commenter_full_name = sub_commenter.full_name
        tenant = current_customer()
        dash_link = 'http://' + tenant.domain_url + '/#/employees/' + str(employee.id)
        template_vars = Context({'employee_name': employee_name, 'dash_link': dash_link, 'commenter_avatar': commenter_avatar,'commenter_full_name': commenter_full_name, 'sub_commenter_avatar': sub_commenter_avatar, 'sub_commenter_full_name': sub_commenter_full_name, 'comment_content': comment_content, 'sub_comment_content': sub_comment_content})
        html_content = html_template.render(template_vars)
        subject = sub_commenter.full_name + ' commented on a post about ' + employee.full_name
        text_content = 'View comment here:\r\n http://' + tenant.domain_url + '/#/employees/' + str(employee.id)
        mail_from = sub_commenter.full_name + '<notify@dfrntlabs.com>'
        msg = EmailMultiAlternatives(subject, text_content, mail_from, mail_to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()


@app.task
def send_checkin_reply_notification(comment_id):
    comment = Comment.objects.get(id=comment_id)
    commenter = Employee.objects.get(user__id=comment.owner.id)
    checkin = CheckIn.objects.get(id=comment.object_id)
    employee = checkin.employee
    host = checkin.host
    other_commenters = Comment.objects.get_for_object(checkin)
    other_commenters = other_commenters.values('owner_id')
    users = User.objects.filter(Q(id__in=other_commenters) | Q(id=host.user.id) | Q(id=employee.user.id))
    users = users.filter(is_active=True)
    users = users.exclude(id=comment.owner.id)
    tenant = current_customer()
    response_url = 'https://%s/#/checkins/%d' % (tenant.domain_url, checkin.id)
    for user in users:
        if user.id == employee.user.id:
            employee_name = 'you'
        elif commenter.id == checkin.employee.id:
            employee_name = 'themself'
        else:
            employee_name = checkin.employee.full_name
        subject = "%s commented on a check-in about %s" % (commenter.full_name, employee_name)
        context = {
            'recipient_first_name': user.employee.first_name,
            'commenter_full_name': commenter.full_name,
            'employee_full_name': employee_name,
            'response_url': response_url,
        }
        text_content = render_to_string('checkins/email/checkin_comment_notification.txt', context)
        html_content = render_to_string('checkins/email/checkin_comment_notification.html', context)
        msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [employee.user.email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()