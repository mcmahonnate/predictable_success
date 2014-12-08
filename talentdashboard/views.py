from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import *
from .decorators import *
from pvp.talentreports import get_talent_category_report_for_all_employees, get_talent_category_report_for_team
from pvp.salaryreports import get_salary_report_for_team, get_salary_report_for_all_employees
from blah.commentreports import get_employees_with_comments
from engagement.engagementreports import get_employees_with_happiness_scores
from blah.models import Comment
from todo.models import Task
from engagement.models import Happiness
from kpi.models import Performance, Indicator
from assessment.models import EmployeeAssessment, MBTI
from org.teamreports import get_mbti_report_for_team
import datetime
from datetime import date, timedelta
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.utils.log import getLogger
from django.core.mail import send_mail, EmailMultiAlternatives
from django.contrib.sites.models import get_current_site
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from PIL import Image, ExifTags
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.urlresolvers import reverse
from django.http import HttpRequest
from django.utils.cache import get_cache_key
from django.core.cache import cache
from django.conf import settings

logger = getLogger('talentdashboard')

def parseBoolString(theString):
  return theString[0].upper()=='T'

class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    queryset = queryset.extra(order_by = ['-last_login'])

class CoachList(generics.ListAPIView):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter(user__groups__id=2)
        
class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()

class MentorshipViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MentorshipSerializer
    queryset = Mentorship.objects.all()

    def get_queryset(self):
        mentee_id = self.request.QUERY_PARAMS.get('mentee_id', None)
        mentor_id = self.request.QUERY_PARAMS.get('mentor_id', None)
        if mentee_id is not None:
            self.queryset = self.queryset.filter(mentee__id=mentee_id)
        if mentor_id is not None:
            self.queryset = self.queryset.filter(mentor__id=mentor_id)

        return self.queryset

class LeadershipsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeadershipSerializer
    queryset = Leadership.objects.all()

    def get_queryset(self):
        employee_id = self.request.QUERY_PARAMS.get('employee_id', None)
        leader_id = self.request.QUERY_PARAMS.get('leader_id', None)
        if employee_id is not None:
            self.queryset = self.queryset.filter(employee__id=employee_id)
        if leader_id is not None:
            self.queryset = self.queryset.filter(leader__id=leader_id)

        return self.queryset

class AttributeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AttributeSerializer
    queryset = Attribute.objects.all()

    def get_queryset(self):
        employee_id = self.request.QUERY_PARAMS.get('employee_id', None)
        category_id = self.request.QUERY_PARAMS.get('category_id', None)
        if employee_id is not None:
            self.queryset = self.queryset.filter(employee__id=employee_id)
        if category_id is not None:
            self.queryset = self.queryset.filter(category__id=category_id)            
            
        return self.queryset

class EmployeeCommentReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = None
        days_ago = self.request.QUERY_PARAMS.get('days_ago', None)
        neglected = request.QUERY_PARAMS.get('neglected', None)
        if neglected is not None:
            neglected = parseBoolString(neglected)
        else:
            neglected = False
        if days_ago is None:
            days_ago = 30
        if(pk == 'all-employees'):
            report = get_employees_with_comments(int(days_ago), neglected)
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class TeamMBTIReportDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            report = get_mbti_report_for_team(pk)
            serializer = MBTIReportSerializer(report)
            return Response(serializer.data)
        except:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

class EmployeeEngagementReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = None
        days_ago = self.request.QUERY_PARAMS.get('days_ago', None)
        neglected = request.QUERY_PARAMS.get('neglected', None)
        if neglected is not None:
            neglected = parseBoolString(neglected)
        else:
            neglected = False
        if days_ago is None:
            days_ago = 30
        if(pk == 'all-employees'):
            report = get_employees_with_happiness_scores(int(days_ago), neglected)
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class TalentCategoryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = None
        if(pk == 'all-employees'):
            report = get_talent_category_report_for_all_employees()
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class TeamTalentCategoryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = get_talent_category_report_for_team(pk)
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class TeamSalaryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = get_salary_report_for_team(pk)
        serializer = SalaryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class EmployeeList(APIView):
    def get(self, request, format=None):
        employees = Employee.objects.filter(display='t')
        employees = employees.exclude(departure_date__isnull=False)
        serializer = MinimalEmployeeSerializer(employees, many=True)
        return Response(serializer.data)

class TeamMemberList(APIView):
    def get(self, request, pk, format=None):
        employees = Employee.objects.filter(team__id=pk)
        employees = employees.filter(display='t')
        employees = employees.exclude(departure_date__isnull=False)

        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

class SubCommentList(APIView):
    def get(self, request, pk, format=None):
        comment_type = ContentType.objects.get(model="comment")
        comments = Comment.objects.filter(object_id = pk)
        comments = comments.filter(content_type=comment_type)
        comments = comments.extra(order_by = ['-created_date'])
        serializer = SubCommentSerializer(comments, many=True)
        return Response(serializer.data)

class EmployeeEngagement(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        current = request.QUERY_PARAMS.get('current', None)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        if current is not None:
            current = parseBoolString(current)
        happys = Happiness.objects.filter(employee__id = pk)
        if current:
            try:
                happy = happys.latest('assessed_date')
                serializer = HappinessSerializer(happy, many=False)
                return Response(serializer.data)
            except:
                return Response(None)
        else:
            happys = happys.extra(order_by = ['-assessed_date'])
            serializer = HappinessSerializer(happys, many=True)
            return Response(serializer.data)
        return Response(None)

    def post(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assessed_by_id = request.DATA["_assessed_by_id"]
        assessed_by = Employee.objects.get(id = assessed_by_id)
        if assessed_by is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assessment = request.DATA["_assessment"]
        happy = Happiness()
        happy.employee = employee
        happy.assessed_by = assessed_by
        happy.assessment = int(assessment)
        happy.save()
        serializer = HappinessSerializer(happy, many=False)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        assessment_id = request.DATA["_assessment_id"]
        assessment = request.DATA["_assessment"]
        happy = Happiness.objects.get(id = assessment_id )
        if happy is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        happy.assessment = int(assessment)
        happy.save()
        serializer = HappinessSerializer(happy, many=False)
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        happy = Happiness.objects.filter(id = pk)
        if happy is not None:
            happy.delete()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class Assessment(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assessments = EmployeeAssessment.objects.filter(employee__id = pk)
        serializer = AssessmentSerializer(assessments, many=True)
        return Response(serializer.data)

class EmployeeMBTI(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        try:
            mbti = MBTI.objects.filter(employee__id = pk)[0]
            serializer = MBTISerializer(mbti, many=False)
            return Response(serializer.data)
        except:
            return Response(None)

class EmployeeCommentList(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        user = Employee.objects.get(user__id = request.user.id)
        employee_type = ContentType.objects.get(model="employee")
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.filter(object_id = pk,content_type=employee_type)
        comments = comments.exclude(object_id=user.id,content_type=employee_type)
        comments = comments.extra(order_by = ['-created_date'])
        serializer = EmployeeCommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        notify = False
        comment_type = ContentType.objects.get(model="comment")
        model_name = request.DATA["_model_name"]
        content_type = ContentType.objects.get(model=model_name)
        object_id = request.DATA["_object_id"]
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        owner = request.user
        content = request.DATA["_content"]
        if content_type == comment_type:
            comment = Comment.objects.get(id = object_id)
            sub_comment = Comment.objects.add_comment(comment,content,owner)
            serializer = SubCommentSerializer(sub_comment, many=False)
            notify = True
            if notify:
                sub_commenter = Employee.objects.get(user__id = request.user.id)
                commenter = Employee.objects.get(user__id = comment.owner_id)
                subject = sub_commenter.full_name + ' commented on your post about ' + employee.full_name
                text_content = 'View comment here:\r\n http://' + get_current_site(request).domain + '/#/employees/' + str(employee.id)
                html_content = ('<h2>' + employee.full_name + '</h2><table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; border-spacing:0; width:100%; text-align:justify; margin:0; padding:0; border-width:0"><tbody><tr>'
                '<td valign="top" style="height:80px; width:50px"><img src="' + commenter.avatar_small + '" height="48" style="display:inline-block; margin-left:auto; margin-right:auto; height:48px; vertical-align:text-top" /></td>'
                '<td valign="top"><p><span style="font-size:14px"></span> <span style="font-size:14px; color:#AA9C84"><b>from ' + commenter.full_name + '</b></span></p>'
                '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; border-spacing:0; width:100%; text-align:justify; margin:0; padding:0; border-width:0"><tbody><tr>'
                '<td valign="top" style="height:80px; width:50px"><img src="' + sub_commenter.avatar_small + '" height="48" style="display:inline-block; margin-left:auto; margin-right:auto; height:48px; vertical-align:text-top"/></td><td valign="top">'
                '<p><span style="font-size:14px"></span> <span style="font-size:14px; color:#AA9C84"><b>from ' + sub_commenter.full_name + '</b></span><br>'
                '<a href="http://' + get_current_site(request).domain + '/#/employees/' + str(employee.id) + '" target="_blank">reply</a> </p><br></td></tr></tbody></table></td></tr></tbody></table>')
                mail_from = sub_commenter.full_name + '<notify@dfrntlabs.com>'
                mail_to = commenter.user.email
                msg = EmailMultiAlternatives(subject, text_content, mail_from, [mail_to])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
        else:
            comment = employee.comments.add_comment(content, owner)
            serializer = EmployeeCommentSerializer(comment, many=False)
        return Response(serializer.data)

class TeamCommentList(APIView):
    def get(self, request, pk, format=None):
        team = Team.objects.get(id = pk)
        team_type = ContentType.objects.get(model="team")
        if team is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.filter(object_id = pk,content_type=team_type)
        comments = comments.extra(order_by = ['-created_date'])
        serializer = TeamCommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        comment_type = ContentType.objects.get(model="comment")
        model_name = request.DATA["_model_name"]
        content_type = ContentType.objects.get(model=model_name)
        object_id = request.DATA["_object_id"]
        team = Team.objects.get(id = pk)
        if team is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        owner = request.user
        content = request.DATA["_content"]
        if content_type == comment_type:
            comment = Comment.objects.get(id = object_id)
            sub_comment = Comment.objects.add_comment(comment,content,owner)
            serializer = SubCommentSerializer(sub_comment, many=False)
            return Response(serializer.data)
        else:
            comment = team.comments.add_comment(content, owner)
            serializer = TeamCommentSerializer(comment, many=False)
            return Response(serializer.data)

class LeadershipDetail(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is not None:
            leaderships = Leadership.objects.filter(employee__id = employee.id)
            leadership = leaderships.latest('start_date')
            if leadership is not None:
                serializer = LeadershipSerializer(leadership, many=False)
                return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        leader_id = request.DATA["_leader_id"]
        leader = Employee.objects.get(id = leader_id)
        leadership = Leadership()
        leadership.employee = employee
        leadership.leader = leader
        leadership.save()
        serializer = LeadershipSerializer(leadership, many=False)
        return Response(serializer.data)

class CommentList(APIView):
    def get(self, request, format=None):
        employee = Employee.objects.get(user__id = request.user.id)
        employee_type = ContentType.objects.get(model='employee')
        comments = Comment.objects.filter(content_type = employee_type)
        comments = comments.exclude(object_id=employee.id)
        comments = comments.extra(order_by = ['-created_date'])[:15]
        serializer = EmployeeCommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentDetail(APIView):
    def get(self, request, pk, format=None):
        comment = Comment.objects.get(id = pk)
        serializer = EmployeeCommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        comment = Comment.objects.filter(id = pk)
        if comment is not None:
            comment.update(content = request.DATA["_content"], modified_date = datetime.datetime.now())
            serializer = EmployeeCommentSerializer(comment, many=False)
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, format=None):
        comment = Comment.objects.filter(id = pk)
        if comment is not None:
            comment.delete()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class MyTaskList(APIView):
    def get(self, request, format=None):
        assigned_to = Employee.objects.get(user__id = request.user.id)
        if assigned_to is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        completed = request.QUERY_PARAMS.get('completed', None)
        if completed is None:
            completed = False
        else:
            completed = parseBoolString(completed)
        tasks = Task.objects.filter(assigned_to__id=assigned_to.id)
        tasks = tasks.filter(completed = completed)
        tasks = tasks.extra(order_by = ['-due_date'])
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskDetail(APIView):
    def get(self, request, pk, format=None):
        task = Task.objects.get(id = pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        task = Task.objects.get(id=pk)
        notify = False
        if task is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assigned_to_id = request.DATA["_assigned_to_id"]
        description = request.DATA["_description"]
        due_date = request.DATA["_due_date"]
        completed = request.DATA["_completed"]
        if assigned_to_id is not None:
            assigned_to = Employee.objects.get(id = assigned_to_id)
            assigned_by = Employee.objects.get(user__id = request.user.id)
            if assigned_to is None:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
            else:
                if task.assigned_to is not None:
                    if task.assigned_to.id != assigned_to.id:
                        task.assigned_by = assigned_by
                        notify = True
                else:
                    task.assigned_by = assigned_by
                    notify = True
                task.assigned_to = assigned_to
        else:
            task.assigned_to = None
        if due_date !="":
            task.due_date = due_date
        task.description = description
        task.completed = completed
        task.save()
        if notify:
            subject = '(' + task.employee.full_name + ') To-do assigned to you: ' + task.description
            message = task.assigned_by.full_name + ' just assigned this to you: \r\n' + task.description + '\r\n http://' + get_current_site(request).domain + '/#/employees/' + str(task.employee.id)
            mail_from = task.assigned_by.full_name + '<notify@dfrntlabs.com>'
            send_mail(subject, message, mail_from, [task.assigned_to.user.email], fail_silently=False)

        return Response(None)

    def delete(self, request, pk, format=None):
        task = Task.objects.filter(id = pk)
        if task is not None:
            task.delete()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class EmployeeTaskList(APIView):
    def get(self, request, pk, format=None):
        if(pk == 'all-employees'):
            employee = Employee.objects.get(user__id = request.user.id)
            days_ahead = request.QUERY_PARAMS.get('days_ahead', None)
            if days_ahead is None:
                days_ahead = 7
            d = date.today()+timedelta(days=int(days_ahead))
            tasks = Task.objects.filter(completed=False).filter(Q(due_date__lt=d) | Q(due_date__isnull=True))
            tasks = tasks.exclude(employee=employee)
        else:
            employee = Employee.objects.get(id = pk)
            if employee is None:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
            completed = request.QUERY_PARAMS.get('completed', None)
            if completed is None:
                completed = False
            else:
                completed = parseBoolString(completed)
            tasks = Task.objects.filter(employee__id = pk)
            tasks = tasks.filter(completed = completed)
            tasks = tasks.extra(order_by = ['-created_date'])
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        employee_id = request.DATA["_employee_id"]
        employee = Employee.objects.get(id = employee_id)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        owner_id = request.DATA["_owner_id"]
        owner = Employee.objects.get(user__id = owner_id)
        if owner is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assigned_to_id = request.DATA["_assigned_to_id"]
        description = request.DATA["_description"]
        due_date = request.DATA["_due_date"]
        task = Task()
        task.employee = employee
        task.created_by = owner
        if assigned_to_id is not None:
            assigned_to = Employee.objects.get(id = assigned_to_id)
            if assigned_to is not None:
                 task.assigned_to = assigned_to
        if description is not None:
             task.description = description
        if due_date is not None:
            task.due_date = due_date
        task.save()
        serializer = TaskSerializer(task)
        return Response(serializer.data)

class EmployeeDetail(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        serializer = EmployeeSerializer(employee)
        if employee is not None:
            if (request.user.groups.filter(name='foolsquad').exists()):
                return Response(serializer.data)
            elif (request.user.groups.filter(name='Coaches').exists()):
                coach = Employee.objects.get(user__id = request.user.id)
                if (employee.coach==coach):
                    return Response(serializer.data)
                else:
                    Response(None, status=status.HTTP_404_NOT_FOUND)
            else:
                Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        def expire_view_cache(view_name, args=[], namespace=None, key_prefix=None, method="GET"):
            """
            This function allows you to invalidate any view-level cache.
                view_name: view function you wish to invalidate or it's named url pattern
                args: any arguments passed to the view function
                namepace: optioal, if an application namespace is needed
                key prefix: for the @cache_page decorator for the function (if any)

                from: http://stackoverflow.com/questions/2268417/expire-a-view-cache-in-django
                added: method to request to get the key generating properly
            """

            # create a fake request object
            new_request = HttpRequest()
            new_request.method = method
            if settings.USE_I18N:
                new_request.LANGUAGE_CODE = settings.LANGUAGE_CODE
            # Loookup the request path:
            if namespace:
                view_name = namespace + ":" + view_name
            new_request.path = reverse(view_name, args=args)
            new_request.META['HTTP_ACCEPT']=request.META['HTTP_ACCEPT']
            keyprefix = settings.CACHE_MIDDLEWARE_KEY_PREFIX
            # get cache key, expire if the cached item exists:
            key = get_cache_key(new_request, key_prefix=keyprefix)
            if key:
                if cache.get(key):
                    cache.delete(key)
                return True
            return False

        if int(pk)==0 and "_full_name" in request.DATA:
            employee = Employee()
            employee.full_name = request.DATA["_full_name"]
            employee.display = True
            employee.save()
            expire_view_cache('employee-list')
            serializer = EmployeeSerializer(employee, many=False)
            return Response(serializer.data)

        employee = Employee.objects.get(id = pk)
        if employee is not None:
            if "_full_name" in request.DATA:
                employee.full_name = request.DATA["_full_name"]
            if "_hire_date" in request.DATA:
                employee.hire_date = request.DATA["_hire_date"]
            if "_departure_date" in request.DATA:
                employee.departure_date = request.DATA["_departure_date"]
                expire_view_cache('employee-list')
            employee.save()
            return Response(None)

        return Response(None, status=status.HTTP_404_NOT_FOUND)

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser,FormParser)

    def post(self, request, pk, format=None):
        def resize(image, size, filename, extension, content_type):
            image.thumbnail(size, Image.ANTIALIAS)
            image_io = StringIO.StringIO()
            image.save(image_io, format=extension)
            image_file = InMemoryUploadedFile(image_io, None, filename, content_type, image_io.len, None)
            return image_file
        employee = Employee.objects.get(id = pk)
        image_obj = request.FILES['file0']
        image = Image.open(image_obj)
        extension = image.format

        if hasattr(image, '_getexif'): # only present in JPEGs
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation]=='Orientation':
                    break
            e = image._getexif()       # returns None if no EXIF data
            if e is not None:
                exif=dict(e.items())
                orientation = exif[orientation]

                if orientation == 3:   image = image.transpose(Image.ROTATE_180)
                elif orientation == 6: image = image.transpose(Image.ROTATE_270)
                elif orientation == 8: image = image.transpose(Image.ROTATE_90)

        filename = image_obj.name
        content_type = image_obj.content_type
        #resize to avatar size
        avatar_size = (215, 215)
        avatar_file = resize(image, avatar_size, filename, extension, content_type)
        employee.avatar = avatar_file

        #resize to small avatar size
        avatar_small_size = (48, 48)
        avatar_small_file = resize(image, avatar_small_size, filename, extension, content_type)
        employee.avatar_small = avatar_small_file

        employee.save()
        serializer = MinimalEmployeeSerializer(employee)
        return Response(serializer.data)

@api_view(['GET'])
def coachee_list(request):
    employee = Employee.objects.get(user__id = request.user.id)
    employees = Employee.objects.filter(coach__id=employee.id)
    employees = employees.filter(display='t')
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def user_status(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
def current_site(request):
    site = Site.objects.get(domain = request.get_host())

    serializer = SiteSerializer(site)
    return Response(serializer.data)

@api_view(['GET'])
def current_kpi_indicator(request):
    indicator = Indicator.objects.all()[0]
    serializer = KPIIndicatorSerializer(indicator)
    return Response(serializer.data)

@api_view(['GET'])
def current_kpi_performance(request):
    performance = Performance.objects.latest('date')
    serializer = KPIPerformanceSerializer(performance)
    return Response(serializer.data)

@api_view(['GET'])
@cache_on_auth(60*15, 'foolsquad')
@group_required('foolsquad')
def get_company_salary_report(request):
    report = get_salary_report_for_all_employees()
    serializer = SalaryReportSerializer(report)
    if report is not None:
        return Response(serializer.data)
    return Response(None, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@cache_on_auth(60*15, 'foolsquad')
@group_required('foolsquad')
def compensation_summaries(request):
    compensation_summaries = CompensationSummary.objects.all()

    employee_id = request.QUERY_PARAMS.get('employee_id', None)
    if employee_id is not None:
        compensation_summaries = compensation_summaries.filter(employee__id=employee_id)

    most_recent = request.QUERY_PARAMS.get('most_recent', None)
    if most_recent is not None:
        if len(compensation_summaries) > 0:
            most_recent_summary = compensation_summaries[0];
            serializer = CompensationSummarySerializer(most_recent_summary, many=False)
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    serializer = CompensationSummarySerializer(compensation_summaries, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@cache_on_auth(60*1440, 'foolsquad', 'Coaches')
@group_required('foolsquad', 'Coaches')
def pvp_evaluations(request):
    current_round = request.QUERY_PARAMS.get('current_round', None)
    employee_id = request.QUERY_PARAMS.get('employee_id', None)
    team_id = request.QUERY_PARAMS.get('team_id', None)    
    talent_category = request.QUERY_PARAMS.get('talent_category', None)
    evaluations = PvpEvaluation.objects.all()
        
    if current_round is not None:
        current_round = EvaluationRound.objects.most_recent()
        evaluations = evaluations.filter(evaluation_round__id = current_round.id)

    if team_id is not None:
        evaluations = evaluations.filter(employee__team_id=int(team_id))

    if employee_id is not None:
        evaluations = evaluations.filter(employee__id=int(employee_id))
        serializer = PvpEvaluationSerializer(evaluations, many=True)
    else:
        evaluations = evaluations.filter(employee__departure_date__isnull=True)
        serializer = MinimalPvpEvaluationSerializer(evaluations, many=True)
    data = serializer.data

    return Response(data)

@api_view(['GET'])
@group_required('foolsquad')
def happiness_reports(request):
    talent_category = request.QUERY_PARAMS.get('talent_category', None)
    days_ago = request.QUERY_PARAMS.get('days_ago', None)
    neglected = request.QUERY_PARAMS.get('neglected', None)
    if days_ago is None:
        days_ago = 30
    d = date.today()-timedelta(days=int(days_ago))
    if neglected is not None:
        neglected = parseBoolString(neglected)
    else:
        neglected = False
    happys = Happiness.objects.filter(assessed_date__gt=d)
    employees = []
    for happy in happys:
        employees.append(happy.employee)

    evaluations = PvpEvaluation.objects.all()
    current_round = EvaluationRound.objects.most_recent()
    if neglected:
        tasks = Task.objects.filter(completed = False).filter(due_date__isnull=False).filter(assigned_to__isnull=False)
        for task in tasks:
            employees.append(task.employee)
        evaluations = evaluations.filter(evaluation_round__id = current_round.id).exclude(employee__in=employees)
    else:
        evaluations = evaluations.filter(evaluation_round__id = current_round.id).filter(employee__in=employees)

    # The talent_category query executes the query, so it needs to happen after all other filters
    if talent_category is not None:
        evaluations = [item for item in evaluations if item.get_talent_category() == int(talent_category)]

    data= [{'empty':1}]
    if len(evaluations)>0:
        serializer = PvpEvaluationSerializer(evaluations, many=True)
        data = serializer.data

    return Response(data)

@api_view(['GET'])
@cache_on_auth(60*15, 'foolsquad')
@group_required('foolsquad')
def team_leads(request):
    team_id = request.QUERY_PARAMS.get('team_id', None)    
    leads = Leadership.objects.filter(leader__team_id=int(team_id))
    current_round = EvaluationRound.objects.most_recent()
    evaluations = PvpEvaluation.objects.filter(employee__team_id=int(team_id))
    evaluations = evaluations.filter(evaluation_round__id = current_round.id)
       
    employees = []
    for lead in leads:
        if lead.leader not in employees:
            employees.append(lead.leader)
            
    evaluations = evaluations.filter(employee__in=employees)            
    serializer = PvpEvaluationSerializer(evaluations, many=True)
    
    return Response(serializer.data)    

@api_view(['GET'])
def team_lead_employees(request):
    current_user = request.user
    lead_id = request.QUERY_PARAMS.get('lead_id', None)    
    lead = Employee.objects.get(id=lead_id)
    if lead.user == current_user or current_user.is_superuser:
        leaderships = Leadership.objects.filter(leader__id=int(lead_id))
        employees = []
        for leadership in leaderships:
            if leadership.employee not in employees:
                employees.append(leadership.employee)
        
        serializer = EmployeeSerializer(employees, many=True)
        
        return Response(serializer.data)        
    else:
        return Response(None, status=status.HTTP_403_FORBIDDEN)