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

# class Sheet(models.Model):
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     title = models.CharField(max_length=200)
#     content = models.TextField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     # เพิ่มฟิลด์อื่นๆ ที่เกี่ยวข้อง (เช่น ผู้แต่ง, วันที่สร้าง)

#     def __str__(self):
#         return self.title

class Sheet(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    # subject_id = models.IntegerField(null=True, blank=True) # หรือเป็น ForeignKey ถ้ามีการเชื่อมโยงกับ Model Subject

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
    # models.py
    @property
    def total_price(self):
        return sum(item.sheet.price * item.quantity for item in self.items.all())


    def __str__(self):
        # ปรับการแสดงผลให้เหมาะสม อาจจะแสดง ID Cart หรือ user ที่เป็นเจ้าของ
        return f"Cart {self.id}" # หรือ f"Cart of {self.user.username}" ถ้ามี user
# class CartItem(models.Model):
#     cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
#     sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField(default=1)
#     # เพิ่มฟิลด์อื่นๆ ที่เกี่ยวข้อง (เช่น added_at)

#     def __str__(self):
#         return f"{self.quantity} x {self.sheet.title} in {self.cart.user.username}'s cart" # จำนวน x ชื่อชีท ในตะกร้าของ user นี้

class CartItem(models.Model):
    # แก้ไขบรรทัดนี้: เพิ่ม related_name='items'
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    create_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True)
    # Add other relevant fields

    def __str__(self):
# ปรับ return ให้เหมาะสม อาจจะแสดงชื่อชีทและ cart id
        return f"{self.sheet.name if self.sheet else 'N/A'} in Cart {self.cart.id if self.cart else 'N/A'}"

# class Order(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     tel = models.CharField(max_length=20)
#     email = models.EmailField()
#     # เพิ่มฟิลด์อื่นๆ ที่เกี่ยวข้อง (เช่น total_amount, created_at, status)

#     def __str__(self):
#         return f"Order by {self.user.username}" # ออเดอร์โดย user นี้

class Order(models.Model):
    # Django จะสร้างฟิลด์ id (Primary Key) ให้อัตโนมัติ

    # ฟิลด์ User ที่เชื่อมโยง (มีอยู่แล้ว)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tel = models.CharField(max_length=20, blank=True, null=True) # เพิ่ม blank=True, null=True ถ้าฟิลด์นี้ไม่จำเป็นต้องมีค่าเสมอ
    email = models.EmailField(blank=True, null=True) # เพิ่ม blank=True, null=True ถ้าฟิลด์นี้ไม่จำเป็นต้องมีค่าเสมอ

    # ฟิลด์วันที่สร้าง (มีอยู่แล้ว)
    created_at = models.DateTimeField(auto_now_add=True)
    # เพิ่มฟิลด์วันที่แก้ไข (ถ้ายังไม่มี)
    modify_date = models.DateTimeField(auto_now=True)

    # *** เพิ่มฟิลด์อื่นๆ ที่คุณต้องการแสดงผล (ถ้ายังไม่มี) ***
    # ฟิลด์ Cart ที่เชื่อมโยง
    # สมมติว่า Order เชื่อมโยงกับ Cart ใบเดียว
    # คุณต้องปรับ on_delete และ related_name ตามความเหมาะสม
    # cart = models.ForeignKey('sheet_service.Cart', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders') # <--- ปรับแก้ 'your_app_name.Cart' และ related_name
    cart = models.ForeignKey(Cart, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')

    # ฟิลด์สำหรับ Total Amount / Total Price
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0) # ใช้ชื่อฟิลด์ total_amount

    # ฟิลด์สำหรับ สถานะของ Order
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    # ฟิลด์สำหรับ จำนวนรายการทั้งหมดใน Order (อาจจะคำนวณจาก OrderItem หรือเก็บไว้ตรงนี้)
    total_items = models.IntegerField(default=0)

    # หมายเหตุ: ฟิลด์ sheet_id โดยทั่วไปจะอยู่ใน OrderItem Model ไม่ได้อยู่ใน Order Model โดยตรง

    def __str__(self):
        # ปรับการแสดงผลให้เหมาะสม อาจจะแสดง ID Order และ User ที่เป็นเจ้าของ
        return f"Order {self.id} by {self.user.username if self.user else 'N/A'}"

    # อาจมีการตั้งค่า Meta class หรือ method อื่นๆ ตามที่คุณมี
    # class Meta:
    #     ordering = ['-created_at'] # ตัวอย่าง: เรียงลำดับตามวันที่สร้างล่าสุด




class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # ราคาสินค้า ณ เวลาที่สั่งซื้อ

    def __str__(self):
        return f"{self.quantity} x {self.sheet.title} in Order {self.order.id}" # จำนวน x ชื่อชีท ในออเดอร์นี้