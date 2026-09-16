from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (
            "EnrichHub Information",
            {
                "fields": (
                    "role",
                    "student_number",
                    "phone_number",
                    "profile_picture",
                    "bio",
                    "course",
                    "year_of_study",
                    "is_verified",
                )
            }
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "EnrichHub Information",
            {
                "fields": (
                    "role",
                    "student_number",
                    "phone_number",
                    "course",
                    "year_of_study",
                )
            }
        ),
    )