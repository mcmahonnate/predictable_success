from tenant_schemas.test.cases import TenantTestCase as TestCase
from activity.models import Event
from blah.models import Comment
from org.models import Employee
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User


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

    def test_get_most_recent(self):
        comment_type = ContentType.objects.get_for_model(Comment)
        employee = Employee(first_name='first', last_name='last', email='first.last@test.com')
        employee.save()
        user = User(email='user@test.com')
        user.save()
        comment = self.create_comment(employee, user)
        event = Event.objects.get(event_id=comment.id)
        self.assertEqual(event.event_type, comment_type)
        self.assertEqual(event.event_id, comment.id)
        self.assertEqual(event.employee.id, comment.object_id)
        self.assertEqual(event.user.id, comment.owner_id)
        self.assertEqual(event.date, comment.created_date)