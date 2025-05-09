# auth_service/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User  # หรือใช้ CustomUser ถ้าใช้

# Serializer สำหรับการลงทะเบียน
class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # ใช้ CustomUser ถ้าใช้
        fields = ['username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}  # ไม่ให้ password ถูกดึงออก
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # ลบ confirm_password ก่อนสร้าง
        user = User.objects.create_user(**validated_data)  # สร้างผู้ใช้ใหม่
        return user

# Serializer สำหรับการเข้าสู่ระบบ
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
