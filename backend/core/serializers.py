from rest_framework import serializers
from .models import (
    UserProfile,
    JobOpportunity,
    JobApplication,
    MentorshipSession,
    CampusPost,
    LibraryBook,
    BookTransferRequest,
    LostAndFoundItem,
    CampusAnnouncement,
    ModerationLog
)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class JobOpportunitySerializer(serializers.ModelSerializer):
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = JobOpportunity
        fields = '__all__'

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.name', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    company = serializers.CharField(source='job.company', read_only=True)

    class Meta:
        model = JobApplication
        fields = '__all__'


class MentorshipSessionSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    mentee_name = serializers.CharField(source='mentee.name', read_only=True)

    class Meta:
        model = MentorshipSession
        fields = '__all__'


class CampusPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)
    author_campus = serializers.CharField(source='author.campus', read_only=True)

    class Meta:
        model = CampusPost
        fields = '__all__'


class LibraryBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryBook
        fields = '__all__'


class BookTransferRequestSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = BookTransferRequest
        fields = '__all__'


class LostAndFoundItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostAndFoundItem
        fields = '__all__'


class CampusAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusAnnouncement
        fields = '__all__'


class ModerationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationLog
        fields = '__all__'
