from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "student_number",
            "phone_number",
            "course",
            "year_of_study",
        ]

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "student_number",
            "phone_number",
            "profile_picture",
            "bio",
            "course",
            "year_of_study",
            "is_verified",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "is_verified",
            "created_at",
        ]