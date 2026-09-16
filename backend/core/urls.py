from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    JobOpportunityViewSet,
    JobApplicationViewSet,
    MentorshipSessionViewSet,
    CampusPostViewSet,
    LibraryBookViewSet,
    BookTransferRequestViewSet,
    LostAndFoundItemViewSet,
    CampusAnnouncementViewSet,
    ModerationLogViewSet,
    database_status,
    execute_query
)

router = DefaultRouter()
router.register(r'users', UserProfileViewSet)
router.register(r'jobs', JobOpportunityViewSet)
router.register(r'applications', JobApplicationViewSet)
router.register(r'mentorship', MentorshipSessionViewSet)
router.register(r'posts', CampusPostViewSet)
router.register(r'books', LibraryBookViewSet)
router.register(r'transfers', BookTransferRequestViewSet)
router.register(r'lost-found', LostAndFoundItemViewSet)
router.register(r'announcements', CampusAnnouncementViewSet)
router.register(r'moderation', ModerationLogViewSet)

urlpatterns = [
    path('db/status/', database_status, name='db-status'),
    path('db/query/', execute_query, name='db-query'),
    path('', include(router.urls)),
]
