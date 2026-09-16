from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    user_id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30, default='student')
    campus = models.CharField(max_length=100, default='Midrand Campus')
    qualification = models.CharField(max_length=50, default='IT')
    academic_year = models.CharField(max_length=50, default='3rd Year')
    verified = models.BooleanField(default=False)
    headline = models.CharField(max_length=255, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    skills = models.JSONField(default=list, blank=True)
    is_mentor = models.BooleanField(default=False)
    avatar_url = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} ({self.role} - {self.campus})"


class JobOpportunity(models.Model):
    job_id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=150, default='Sandton, Gauteng')
    campus_target = models.CharField(max_length=150, default='All Campuses')
    job_type = models.CharField(max_length=50, default='Graduate Programme')
    qualification = models.CharField(max_length=50, default='IT')
    stipend_or_salary = models.CharField(max_length=100, default='R18,000 / month')
    deadline = models.CharField(max_length=50, default='30 Oct 2026')
    description = models.TextField(blank=True, default='')
    requirements = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=30, default='approved')
    recruiter = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='posted_jobs')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} at {self.company}"


class JobApplication(models.Model):
    application_id = models.CharField(max_length=64, primary_key=True)
    job = models.ForeignKey(JobOpportunity, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, default='under_review')
    resume_url = models.CharField(max_length=500, blank=True, default='')
    cover_note = models.TextField(blank=True, default='')
    has_elevator_pitch = models.BooleanField(default=True)
    elevator_pitch_video_url = models.CharField(max_length=500, blank=True, default='')
    applied_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"App: {self.applicant.name} -> {self.job.title}"


class MentorshipSession(models.Model):
    session_id = models.CharField(max_length=64, primary_key=True)
    mentor = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='mentor_sessions')
    mentee = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='mentee_sessions')
    topic = models.CharField(max_length=200)
    domain = models.CharField(max_length=100, default='Software Engineering')
    status = models.CharField(max_length=30, default='scheduled')
    scheduled_time = models.CharField(max_length=100, default='Today at 14:00')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Session: {self.topic} ({self.status})"


class CampusPost(models.Model):
    post_id = models.CharField(max_length=64, primary_key=True)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    cohort = models.CharField(max_length=100, default='BSc IT 3rd Year')
    likes_count = models.IntegerField(default=0)
    moderation_status = models.CharField(max_length=30, default='approved')
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Post by {self.author.name}: {self.content[:40]}"


class LibraryBook(models.Model):
    book_id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=150)
    isbn = models.CharField(max_length=50, blank=True, default='')
    module_code = models.CharField(max_length=20, default='IT301')
    holding_campus = models.CharField(max_length=100, default='Midrand Campus')
    total_copies = models.IntegerField(default=5)
    available_copies = models.IntegerField(default=3)

    def __str__(self):
        return f"{self.title} ({self.holding_campus})"


class BookTransferRequest(models.Model):
    transfer_id = models.CharField(max_length=64, primary_key=True)
    book = models.ForeignKey(LibraryBook, on_delete=models.CASCADE, related_name='transfers')
    student = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='book_transfers')
    from_campus = models.CharField(max_length=100)
    to_campus = models.CharField(max_length=100)
    status = models.CharField(max_length=30, default='in_transit')
    courier_tracking_number = models.CharField(max_length=50, blank=True, default='')
    request_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Transfer {self.transfer_id}: {self.from_campus} -> {self.to_campus}"


class LostAndFoundItem(models.Model):
    item_id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default='Electronics')
    campus_location = models.CharField(max_length=100, default='Sandton Campus Lab 4')
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=40, default='found_unclaimed')
    held_at_security_desk = models.BooleanField(default=True)
    reported_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True)
    date_reported = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} ({self.campus_location})"


class CampusAnnouncement(models.Model):
    announcement_id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    target_audience = models.CharField(max_length=50, default='All')
    priority = models.CharField(max_length=20, default='high')
    image_url = models.CharField(max_length=500, blank=True, default='')
    image_caption = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class ModerationLog(models.Model):
    log_id = models.CharField(max_length=64, primary_key=True)
    content_type = models.CharField(max_length=50, default='post')
    content_snippet = models.TextField()
    toxicity_score = models.FloatField(default=0.0)
    action_taken = models.CharField(max_length=30, default='approved')
    reviewed_by = models.CharField(max_length=100, default='AI Safety Guard')
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Log {self.log_id} ({self.action_taken})"
