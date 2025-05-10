# ในไฟล์ user_service/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

# สร้าง Custom User Model ที่สืบทอดจาก AbstractUser
# AbstractUser มี fields พื้นฐานเช่น username, password, email, first_name, last_name, is_staff, is_active, date_joined อยู่แล้ว
class CustomUser(AbstractUser):
    # Override field email เพื่อให้เป็น unique
    # การทำให้ unique=True จะบังคับว่าในฐานข้อมูลจะไม่มีผู้ใช้สองคนที่มี email เดียวกันได้
    # blank=True, null=True ทำให้ email เป็น optional (ไม่ต้องกรอกก็ได้)
    # ถ้าต้องการให้ email เป็น field ที่ต้องกรอก ให้ลบ blank=True, null=True ออก
    email = models.EmailField(unique=True, blank=True, null=True)

    # สามารถเพิ่ม fields ใหม่ที่คุณต้องการสำหรับ User ของคุณที่นี่ได้
    # เช่น:
    # date_of_birth = models.DateField(null=True, blank=True)
    # profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    # USERNAME_FIELD และ REQUIRED_FIELDS
    # ถ้าใช้ AbstractUser, USERNAME_FIELD จะเป็น 'username' อยู่แล้ว
    # REQUIRED_FIELDS ใช้สำหรับตอนสร้าง user ด้วย createsuperuser
    # ถ้า email ไม่ได้บังคับให้กรอก (blank=True) ก็ไม่ต้องเพิ่มใน REQUIRED_FIELDS

    # ตั้งค่า Meta options หากต้องการ (เช่น กำหนดชื่อตารางใน DB)
    # class Meta:
    #     db_table = 'custom_users' # ตัวอย่างการเปลี่ยนชื่อตาราง

    # กำหนด method __str__ เพื่อให้แสดง username เมื่อเรียก print(user)
    def __str__(self):
        return self.username

# ไม่จำเป็นต้องมี User Model อื่นๆ อีก ถ้าคุณกำหนด AUTH_USER_MODEL เป็น CustomUser ตัวนี้แล้ว