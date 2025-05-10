# sheets_service/authentication.py
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.conf import settings

# นำเข้า Custom Token Model ที่เราสร้างขึ้น
from .models import ExpiringToken # หรือชื่อ Model ที่คุณตั้งไว้

class ExpiringTokenAuthentication(TokenAuthentication):
    # Override method authenticate_credentials
    # method นี้จะถูกเรียกเมื่อมี request ส่ง header Authorization: Token <key> มา
    def authenticate_credentials(self, key):
        # ใช้ try-except เพื่อจัดการกรณี Token key ไม่ถูกต้อง
        try:
            # ค้นหา Token จาก key ที่ส่งมา โดยใช้ Custom Token Model ของเรา
            token = ExpiringToken.objects.select_related('user').get(key=key)
        except ExpiringToken.DoesNotExist:
            # ถ้าไม่พบ Token ให้ Authentication Failed
            raise AuthenticationFailed('Invalid token.') # Token ไม่ถูกต้อง

        # ตรวจสอบว่า Token หมดอายุหรือยัง
        # ดึงเวลาปัจจุบัน
        now = timezone.now()
        # ดึงเวลาที่สร้าง Token จากฟิลด์ created ใน Custom Token Model
        token_creation_time = token.created

        # คำนวณว่า Token นี้มีอายุเท่าไรแล้ว (เวลาปัจจุบัน - เวลาที่สร้าง)
        token_age = now - token_creation_time

        # ดึงระยะเวลาหมดอายุจาก settings (แปลงวินาทีเป็น timedelta)
        # ใช้ getattr เพื่อดึงค่า settings และกำหนดค่า default ถ้าไม่มี
        expiry_time_seconds = getattr(settings, 'TOKEN_EXPIRY_TIME', 86400) # ค่า default 24 ชั่วโมง
        expiry_time_delta = timezone.timedelta(seconds=expiry_time_seconds)


        # ตรวจสอบว่าอายุ Token มากกว่าระยะเวลาหมดอายุหรือไม่
        if token_age > expiry_time_delta:
            # ถ้าหมดอายุ ให้ Authentication Failed และอาจลบ Token เก่าทิ้ง (ทางเลือก)
            # token.delete() # อาจลบ Token เก่าทิ้งตรงนี้เลยก็ได้
            raise AuthenticationFailed('Token has expired.') # Token หมดอายุแล้ว

        # ถ้า Token ยังไม่หมดอายุ และผู้ใช้ active อยู่
        if not token.user.is_active:
            # ถ้าผู้ใช้ไม่ active ก็ Authentication Failed
            raise AuthenticationFailed('User inactive or deleted.') # ผู้ใช้ไม่ active

        # ถ้าทุกอย่างถูกต้อง ให้คืนค่า (user, token) tuple
        # rest_framework จะใช้คู่นี้ในการกำหนด request.user และ request.auth
        return (token.user, token)

    # อาจ Override method authenticate ก็ได้ถ้าต้องการ logic ที่ซับซ้อนกว่า
    # แต่ authenticate_credentials ก็เพียงพอในหลายกรณี
    # def authenticate(self, request):
    #     # ... โค้ดตรวจสอบ header Authorization ...
    #     return self.authenticate_credentials(token_key) # เรียก authenticate_credentials ต่อไป