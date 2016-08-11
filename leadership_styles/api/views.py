from org.api.permissions import UserIsEmployeeOrLeaderOrCoachOfEmployee, UserIsEmployee, PermissionsViewAllEmployees
from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .permissions import UserIsAssessorOrHasAllAccess
from .serializers import *


class CreateEmployeeLeadershipStyle(CreateAPIView):
    serializer_class = CreateEmployeeLeadershipStyleSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        saved = self.perform_create(serializer)
        serializer = EmployeeLeadershipStyleSerializer(instance=saved, context={'request': request})

        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()


class RetrieveEmployeeLeadershipStyle(RetrieveAPIView):
    serializer_class = EmployeeLeadershipStyleSerializer
    permission_classes = (IsAuthenticated, UserIsEmployeeOrLeaderOrCoachOfEmployee)
    queryset = EmployeeLeadershipStyle.objects.all()

    def get_employee(self):
        employee_leadership_style = self.get_employee_leadership_style()
        return employee_leadership_style.employee

    def get_employee_leadership_style(self):
        try:
            return self.get_object()
        except EmployeeLeadershipStyle.DoesNotExist:
            raise Http404()


class RetrieveMyEmployeeLeadershipStyle(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        employee = self.request.user.employee
        try:
            leadership_style = EmployeeLeadershipStyle.objects.filter(employee=employee, assessor=employee).latest('date')
        except EmployeeLeadershipStyle.DoesNotExist:
            leadership_style = EmployeeLeadershipStyle(employee=employee, assessor=employee)
            leadership_style.save()
        serializer = EmployeeLeadershipStyleSerializer(leadership_style, context={'request': request})
        return Response(serializer.data)


class RetrieveUnfinishedEmployeeLeadershipStyle(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, format=None):
        employee = self.request.user.employee
        leadership_style = EmployeeLeadershipStyle.objects.get_unfinished(employee=employee)
        if leadership_style is None:
            raise Http404()
        serializer = EmployeeLeadershipStyleSerializer(leadership_style, context={'request': request})
        return Response(serializer.data)


class UpdateEmployeeLeadershipStyle(RetrieveUpdateAPIView):
    queryset = EmployeeLeadershipStyle.objects.all()
    permission_classes = (IsAuthenticated, UserIsAssessorOrHasAllAccess,)
    serializer_class = UpdateEmployeeLeadershipStyleSerializer

    def get_leadership_style(self):
        return self.get_object()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        serializer = EmployeeLeadershipStyleSerializer(instance, context={'request': request})
        return Response(serializer.data)


class RetakeEmployeeLeadershipStyle(GenericAPIView):
    queryset = EmployeeLeadershipStyle.objects.all()
    serializer_class = EmployeeLeadershipStyleSerializer
    permission_classes = (IsAuthenticated, UserIsEmployee)

    def get_employee(self):
        leadership_style = self.get_object()
        return leadership_style.employee

    def put(self, request, pk, format=None):
        employee_leadership_style = self.get_object()
        employee_leadership_style.answers = []
        employee_leadership_style.last_question_answered = None
        employee_leadership_style.notes = ''
        employee_leadership_style.times_retaken += 1
        employee_leadership_style.save()
        serializer = EmployeeLeadershipStyleSerializer(employee_leadership_style, context={'request':request})
        return Response(serializer.data)
