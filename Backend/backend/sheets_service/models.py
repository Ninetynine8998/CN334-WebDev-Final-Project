# sheets_service/models.py
from django.db import models
from django.contrib.auth.models import User # ใช้โมเดล User ที่มีในตัวของ Django
from django.conf import settings # นำเข้า settings

# นำเข้า AbstractBaseUser, BaseUserManager ถ้าจะสร้าง Custom User Model ทั้งหมด (ไม่ใช่เคสนี้)
# from django.contrib.auth.models import User # User มาตรฐาน

# นำเข้า Token Model มาตรฐานที่เราจะสืบทอด
from rest_framework.authtoken.models import Token

# สร้าง Model Token ของเราที่สืบทอดมาจาก Token มาตรฐาน
class ExpiringToken(Token):
    # อาจเพิ่มฟิลด์ expires_at หรือ expires_in ได้ถ้าต้องการ แต่การใช้ created และคำนวณตอนตรวจสอบง่ายกว่า
    # expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        # อาจไม่ต้องมี Meta ถ้าไม่มีการตั้งค่าเพิ่มเติม
        pass

class Subject(models.Model):
    name = models.CharField(max_length=100)
    # เพิ่มฟิลด์อื่นๆ ที่เกี่ยวข้อง

    def __str__(self):
        return self.name

class Sheet(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    name = models.CharField(max_length=200) # ตรงกับ name ใน ER
    # เพิ่มฟิลด์ที่ขาดไปตาม ER Diagram:
    subject_code = models.CharField(max_length=10, blank=True, null=True) # กำหนดให้ว่าง/null ได้ ถ้าข้อมูลเก่าไม่มี
    level = models.CharField(max_length=50, blank=True, null=True) # กำหนดให้ว่าง/null ได้
    # image อาจจะเป็น ImageField หรือ CharField เก็บ URL แล้วแต่การจัดการไฟล์
    # ใช้ CharField สำหรับ URL/Path และกำหนดให้ว่าง/null ได้ เพื่อความง่ายในการ migrate
    image = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField() # ตรงกับ description ใน ER
    # เพิ่มฟิลด์ Date/Time:
    modify_date = models.DateTimeField(auto_now=True) # อัปเดตเวลาทุกครั้งที่บันทึก object
    create_date = models.DateTimeField(auto_now_add=True) # บันทึกเวลาเมื่อสร้าง object ครั้งแรก

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    modify_date = models.DateTimeField(auto_now=True) # อัปเดตเวลาทุกครั้งที่บันทึก Object
    create_date = models.DateTimeField(auto_now_add=True) # บันทึกเวลาเมื่อสร้าง Object ครั้งแรก
    # เพิ่มฟิลด์อื่นๆ ที่เกี่ยวข้อง (เช่น created_at)

    def __str__(self):
        return f"Cart of {self.user.username}" # ตะกร้าของ user นี้

class CartItem(models.Model):
    # แก้ไขบรรทัดนี้: เพิ่ม related_name='items'
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    # Add other relevant fields

    def __str__(self):
        return f"{self.quantity} x {self.sheet.title} in {self.cart.user.username}'s cart"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tel = models.CharField(max_length=20)
    email = models.EmailField()
    # เพิ่มฟิลด์ created_at เข้าไปตรงนี้ครับ
    created_at = models.DateTimeField(auto_now_add=True) # บันทึกเวลาสร้างออเดอร์อัตโนมัติ
    # Add other relevant fields (e.g., total_amount, status)

    def __str__(self):
        return f"Order by {self.user.username} ({self.id})" # อาจเพิ่ม ID เข้าไปด้วย

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # ราคาสินค้า ณ เวลาที่สั่งซื้อ

    def __str__(self):
        return f"{self.quantity} x {self.sheet.title} in Order {self.order.id}" # จำนวน x ชื่อชีท ในออเดอร์นี้