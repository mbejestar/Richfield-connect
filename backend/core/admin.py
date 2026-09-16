from django.contrib import admin
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

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'name', 'email', 'role', 'campus', 'qualification', 'verified')
    list_filter = ('role', 'campus', 'qualification', 'verified')
    search_fields = ('name', 'email', 'user_id')

@admin.register(JobOpportunity)
class JobOpportunityAdmin(admin.ModelAdmin):
    list_display = ('job_id', 'title', 'company', 'location', 'job_type', 'status')
    list_filter = ('job_type', 'status', 'qualification')
    search_fields = ('title', 'company')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('application_id', 'job', 'applicant', 'status', 'applied_date')
    list_filter = ('status',)

@admin.register(MentorshipSession)
class MentorshipSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'mentor', 'mentee', 'topic', 'status', 'scheduled_time')
    list_filter = ('status', 'domain')

@admin.register(CampusPost)
class CampusPostAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'author', 'cohort', 'likes_count', 'moderation_status')
    list_filter = ('moderation_status', 'cohort')

@admin.register(LibraryBook)
class LibraryBookAdmin(admin.ModelAdmin):
    list_display = ('book_id', 'title', 'author', 'module_code', 'holding_campus', 'available_copies', 'total_copies')
    list_filter = ('holding_campus', 'module_code')
    search_fields = ('title', 'author', 'isbn')

@admin.register(BookTransferRequest)
class BookTransferRequestAdmin(admin.ModelAdmin):
    list_display = ('transfer_id', 'book', 'student', 'from_campus', 'to_campus', 'status')
    list_filter = ('status', 'from_campus', 'to_campus')

@admin.register(LostAndFoundItem)
class LostAndFoundItemAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'title', 'category', 'campus_location', 'status', 'held_at_security_desk')
    list_filter = ('category', 'status', 'held_at_security_desk')

@admin.register(CampusAnnouncement)
class CampusAnnouncementAdmin(admin.ModelAdmin):
    list_display = ('announcement_id', 'title', 'target_audience', 'priority', 'created_at')
    list_filter = ('target_audience', 'priority')

@admin.register(ModerationLog)
class ModerationLogAdmin(admin.ModelAdmin):
    list_display = ('log_id', 'content_type', 'toxicity_score', 'action_taken', 'timestamp')
    list_filter = ('action_taken', 'content_type')
