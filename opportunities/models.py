from django.conf import settings
from django.db import models


class Opportunity(models.Model):

    TYPE_CHOICES = [
        ("job", "Job"),
        ("internship", "Internship"),
        ("bursary", "Bursary"),
        ("graduate", "Graduate Programme"),
        ("mentorship", "Mentorship"),
    ]

    title = models.CharField(max_length=255)

    company = models.CharField(max_length=255)

    description = models.TextField()

    opportunity_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES
    )

    location = models.CharField(
        max_length=255,
        blank=True
    )

    application_url = models.URLField(
        blank=True
    )

    deadline = models.DateTimeField(
        blank=True,
        null=True
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="opportunities"
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title