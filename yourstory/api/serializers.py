from rest_framework import serializers
from org.api.serializers import MinimalEmployeeSerializer
from ..models import TextResponse, EmployeeChoiceResponse, YourStory


class TextResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextResponse
        fields = ('question', 'text', 'question_type')


class EmployeeChoiceResponseSerializer(serializers.ModelSerializer):
    employees = MinimalEmployeeSerializer(many=True)

    def get_question_type(self, obj):
        return 'employee-choice'

    class Meta:
        model = EmployeeChoiceResponse
        fields = ('question', 'employees', 'question_type')




class YourStorySerializer(serializers.ModelSerializer):
    employee = MinimalEmployeeSerializer()
    answers = serializers.SerializerMethodField()

    response_type_serializers = {
        EmployeeChoiceResponse: EmployeeChoiceResponseSerializer,
        TextResponse: TextResponseSerializer,
    }

    def get_answers(self, obj):
        answers = []
        for item in obj.answers:
            if self.answer_should_be_included(item):
                serializer = self.response_type_serializers.get(type(item))
                answers.append(serializer().to_representation(item))
        return answers

    class Meta:
        model = YourStory
        fields = ('employee', 'answers', 'total_questions', 'next_unanswered_question_number')


class PublicYourStorySerializer(YourStorySerializer):

    def answer_should_be_included(self, answer):
        return answer is not None and answer.is_public


class PrivateYourStorySerializer(YourStorySerializer):

    def answer_should_be_included(self, answer):
        return answer is not None
