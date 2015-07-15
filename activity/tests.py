from tenant_schemas.test.cases import TenantTestCase as TestCase
from activity.models import Event
from blah.models import Comment
from checkins.models import CheckIn
from org.models import Employee
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
import datetime
import pytz

utc=pytz.UTC


class EventTest(TestCase):

    def create_comment(self, employee, user):
        object_type = ContentType.objects.get_for_model(Employee)
        owner_content_type = ContentType.objects.get_for_model(User)
        comment = Comment(content='test content')
        comment.content_type = object_type
        comment.object_id = employee.id
        comment.owner_content_type = owner_content_type
        comment.owner_id = user.id
        comment.save()

        return comment

    def test_create_event_on_comment_save(self):
        comment_type = ContentType.objects.get_for_model(Comment)
        employee = Employee(first_name='first', last_name='last', email='first.last@test.com')
        employee.save()
        user = User(email='user@test.com')
        user.save()
        comment = self.create_comment(employee, user)
        event = Event.objects.get(event_type=comment_type, event_id=comment.id)
        self.assertEqual(event.event_type, comment_type)
        self.assertEqual(event.event_id, comment.id)
        self.assertEqual(event.employee.id, comment.object_id)
        self.assertEqual(event.user.id, comment.owner_id)
        self.assertEqual(event.date, comment.created_date)

    def create_checkin(self, employee, host):
        checkin = CheckIn(employee=employee, host=host, summary='test summary', date=utc.localize(datetime.datetime.now()))
        checkin.save()

        return checkin

    def test_create_event_on_checkin_save(self):
        checkin_type = ContentType.objects.get_for_model(CheckIn)
        employee = Employee(first_name='first', last_name='last', email='first.last@test.com')
        employee.save()
        user = User(email='user@test.com')
        user.save()
        host = Employee(first_name='John', last_name='Doe', email='john.doe@test.com')
        host.user = user
        host.save()
        checkin = self.create_checkin(employee, host)
        event = Event.objects.get(event_type=checkin_type, event_id=checkin.id)
        self.assertEqual(event.event_type, checkin_type)
        self.assertEqual(event.event_id, checkin.id)
        self.assertEqual(event.employee.id, checkin.employee.id)
        self.assertEqual(event.user.id, checkin.host.id)
        self.assertEqual(event.date, checkin.date)
