# ในไฟล์ user_service/views.py

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer # Import ตัวนี้ด้วย

# Import TokenObtainPairView จาก simplejwt
from rest_framework_simplejwt.views import TokenObtainPairView # Import ตัวนี้

User = get_user_model()

# View สำหรับลงทะเบียน (โค้ดเดิม)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# View สำหรับดูข้อมูลผู้ใช้ (โค้ดเดิม)
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

# ตัวอย่าง View อื่นๆ ที่ต้องการ JWT (โค้ดเดิม)
class AnotherProtectedView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        content = {'message': f'Hello from another protected view, {request.user.username}!'}
        return Response(content)

# *** เพิ่มโค้ดส่วนนี้เข้ามา ***
# View สำหรับ Login ที่ใช้ Serializer ที่เราสร้างขึ้น
class CustomTokenObtainPairView(TokenObtainPairView):
    # กำหนดให้ใช้ Serializer ที่เราสร้าง
    serializer_class = CustomTokenObtainPairSerializer
    # โดยทั่วไป View นี้ไม่จำเป็นต้อง override logic ใดๆ เพราะ logic อยู่ใน Serializer แล้ว