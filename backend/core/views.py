import os
import time
from django.db import connection
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
from .serializers import (
    UserProfileSerializer,
    JobOpportunitySerializer,
    JobApplicationSerializer,
    MentorshipSessionSerializer,
    CampusPostSerializer,
    LibraryBookSerializer,
    BookTransferRequestSerializer,
    LostAndFoundItemSerializer,
    CampusAnnouncementSerializer,
    ModerationLogSerializer
)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().order_by('-created_at')
    serializer_class = UserProfileSerializer


class JobOpportunityViewSet(viewsets.ModelViewSet):
    queryset = JobOpportunity.objects.all().order_by('-created_at')
    serializer_class = JobOpportunitySerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by('-applied_date')
    serializer_class = JobApplicationSerializer


class MentorshipSessionViewSet(viewsets.ModelViewSet):
    queryset = MentorshipSession.objects.all().order_by('-created_at')
    serializer_class = MentorshipSessionSerializer


class CampusPostViewSet(viewsets.ModelViewSet):
    queryset = CampusPost.objects.all().order_by('-created_at')
    serializer_class = CampusPostSerializer


class LibraryBookViewSet(viewsets.ModelViewSet):
    queryset = LibraryBook.objects.all().order_by('title')
    serializer_class = LibraryBookSerializer


class BookTransferRequestViewSet(viewsets.ModelViewSet):
    queryset = BookTransferRequest.objects.all().order_by('-request_date')
    serializer_class = BookTransferRequestSerializer


class LostAndFoundItemViewSet(viewsets.ModelViewSet):
    queryset = LostAndFoundItem.objects.all().order_by('-date_reported')
    serializer_class = LostAndFoundItemSerializer


class CampusAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = CampusAnnouncement.objects.all().order_by('-created_at')
    serializer_class = CampusAnnouncementSerializer


class ModerationLogViewSet(viewsets.ModelViewSet):
    queryset = ModerationLog.objects.all().order_by('-timestamp')
    serializer_class = ModerationLogSerializer


@api_view(['GET'])
def database_status(request):
    db_path = settings.DATABASES['default']['NAME']
    file_size_kb = 0
    if os.path.exists(db_path):
        file_size_kb = round(os.path.getsize(db_path) / 1024, 1)

    tables_info = [
        {"table": "core_userprofile", "name": "Users & Student Profiles", "count": UserProfile.objects.count()},
        {"table": "core_jobopportunity", "name": "Jobs & Bursaries", "count": JobOpportunity.objects.count()},
        {"table": "core_jobapplication", "name": "Job Applications", "count": JobApplication.objects.count()},
        {"table": "core_mentorshipsession", "name": "Mentorship Sessions", "count": MentorshipSession.objects.count()},
        {"table": "core_campuspost", "name": "Announcements & Feed Posts", "count": CampusPost.objects.count()},
        {"table": "core_librarybook", "name": "Library Holdings", "count": LibraryBook.objects.count()},
        {"table": "core_booktransferrequest", "name": "Book Transfer Requests", "count": BookTransferRequest.objects.count()},
        {"table": "core_lostandfounditem", "name": "Lost & Found Items", "count": LostAndFoundItem.objects.count()},
        {"table": "core_campusannouncement", "name": "Campus Announcements", "count": CampusAnnouncement.objects.count()},
        {"table": "core_moderationlog", "name": "Moderation Audit Logs", "count": ModerationLog.objects.count()},
    ]

    total_records = sum(t["count"] for t in tables_info)

    # Get recent migrations
    recent_migrations = []
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT app || '.' || name FROM django_migrations ORDER BY applied DESC LIMIT 15;")
            recent_migrations = [row[0] for row in cursor.fetchall()]
    except Exception:
        pass

    return Response({
        "status": "connected",
        "engine": settings.DATABASES['default']['ENGINE'],
        "framework": "Django 5.2.17 (Python 3.10)",
        "database_name": os.path.basename(db_path),
        "database_path": str(db_path),
        "file_size_kb": file_size_kb,
        "total_tables": len(tables_info),
        "total_records": total_records,
        "tables": tables_info,
        "recent_migrations": recent_migrations,
        "timestamp": time.time()
    })


@api_view(['POST'])
def execute_query(request):
    sql = request.data.get('sql', '').strip()
    if not sql:
        return Response({"error": "No SQL statement provided"}, status=status.HTTP_400_BAD_REQUEST)

    start_time = time.time()

    # Safety check: allow SELECT or EXPLAIN or PRAGMA statements
    first_word = sql.split()[0].upper() if sql.split() else ''
    if first_word not in ['SELECT', 'EXPLAIN', 'PRAGMA']:
        return Response({
            "error": f"Operation '{first_word}' is restricted in query runner. Use SELECT statements to inspect data."
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        with connection.cursor() as cursor:
            cursor.execute(sql)
            columns = [col[0] for col in cursor.description] if cursor.description else []
            rows = cursor.fetchall()
            
            # Format row dicts
            formatted_rows = []
            for row in rows:
                formatted_rows.append(dict(zip(columns, row)))

            execution_time_ms = round((time.time() - start_time) * 1000, 2)

            return Response({
                "columns": columns,
                "rows": formatted_rows,
                "row_count": len(formatted_rows),
                "executionTimeMs": execution_time_ms
            })
    except Exception as e:
        execution_time_ms = round((time.time() - start_time) * 1000, 2)
        return Response({
            "error": str(e),
            "executionTimeMs": execution_time_ms
        }, status=status.HTTP_400_BAD_REQUEST)
