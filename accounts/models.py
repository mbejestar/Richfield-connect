from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = [
        ("student", "Student"),
        ("alumni", "Alumni"),
        ("business", "Business User"),
        ("lecturer", "Lecturer"),
        ("admin", "Administrator"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="student"
    )

    student_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        unique=True
    )

    phone_number = models.CharField(
        max_length=30,
        blank=True
    )

    profile_picture = models.URLField(
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    course = models.CharField(
        max_length=200,
        blank=True
    )

    year_of_study = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    is_verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.username} - {self.role}"