from rest_framework.decorators import api_view, permission_classes  # เพิ่มบรรทัดนี้
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser  # ใช้ CustomUser แทน User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        # ตรวจสอบว่า password และ confirm_password ตรงกันไหม
        if password != confirm_password:
            return Response({'status': 'error', 'message': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        # ตรวจสอบว่า username มีอยู่แล้วในระบบไหม
        if get_user_model().objects.filter(username=username).exists():
            return Response({'status': 'error', 'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # ตรวจสอบ password ตามกฎที่ตั้งไว้
        try:
            validate_password(password)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # สร้าง user ใหม่
        user = get_user_model().objects.create_user(username=username, email=email, password=password)

        return Response({'status': 'success', 'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'status': 'error', 'message': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user:
            try:
                # Try to create or get the token
                token, created = Token.objects.get_or_create(user=user)
                return Response({'status': 'success', 'token': token.key})
            except Exception as e:
                # Log error for debugging
                return Response({'status': 'error', 'message': f'Error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'status': 'error', 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)