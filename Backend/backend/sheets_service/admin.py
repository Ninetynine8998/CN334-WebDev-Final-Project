# sheets_service/admin.py
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from django.utils.html import format_html # อาจต้องใช้ถ้าจะแสดงผลเป็นรูปภาพ
from .models import Subject, Sheet, Cart, CartItem, Order, OrderItem, ExpiringToken
from rest_framework.authtoken.models import Token as DefaultToken # นำเข้า Token มาตรฐานเพื่อลงทะเบียนด้วย ถ้าจำเป็น

# --- Inline Models (สำหรับแสดงรายการย่อยในหน้าหลัก) ---

# Inline สำหรับแสดงรายการ CartItem ในหน้าแก้ไข Cart
class CartItemInline(admin.TabularInline): # หรือ admin.StackedInline สำหรับรูปแบบที่แตกต่าง
    model = CartItem
    extra = 0 # ไม่แสดงฟอร์มว่างเพิ่มเติมตอนแรก
    # หากต้องการกำหนดฟิลด์ที่จะแสดงใน Inline
    fields = ('sheet', 'quantity')
    readonly_fields = ('sheet',) # อาจทำให้ sheet อ่านอย่างเดียวหลังสร้าง


# Inline สำหรับแสดงรายการ OrderItem ในหน้าแก้ไข Order
class OrderItemInline(admin.TabularInline): # หรือ admin.StackedInline
    model = OrderItem
    extra = 0
    # หากต้องการกำหนดฟิลด์ที่จะแสดงใน Inline
    fields = ('sheet', 'quantity', 'price')
    readonly_fields = ('sheet', 'price') # อาจทำให้ sheet, price อ่านอย่างเดียว


# --- ModelAdmin (สำหรับการปรับแต่งการแสดงผลใน Admin) ---

# ModelAdmin สำหรับ Cart
class CartAdmin(admin.ModelAdmin):
    # ฟิลด์ที่จะแสดงในหน้ารายการ Cart
    list_display = (
        'cart_id', # <--- เปลี่ยนตรงนี้จาก 'id' เป็นชื่อ method
        'user',
        'get_total_items',
        'create_date',   # <--- เพิ่มฟิลด์ create_date (ถ้ามีใน Model Cart)
        'modify_date',   # <--- เพิ่มฟิลด์ modify_date (ถ้ามีใน Model Cart)
    )
    # ฟิลด์ที่ใช้ในการค้นหาในหน้ารายการ
    search_fields = ('user__username',)
    # ฟิลด์ที่ใช้ในการกรองในหน้ารายการ
    list_filter = ('user',)
    # เพิ่ม Inline เพื่อแสดงรายการ CartItem ในหน้าแก้ไข Cart
    inlines = [CartItemInline]

    # Method สำหรับแสดง id เป็น cart_id ในการแสดงผล
    def cart_id(self, obj): # <--- สร้าง method นี้ขึ้นมา
        return obj.id
    cart_id.short_description = 'cart_id' # <--- ตั้งชื่อหัวคอลัมน์

    # Method เพื่อคำนวณจำนวนสินค้ารวมในตะกร้า (มีอยู่แล้ว)
    def get_total_items(self, obj):
        return obj.items.count()
    get_total_items.short_description = 'Total Items'


# ModelAdmin สำหรับ CartItem (ถ้าต้องการจัดการ CartItem แยกต่างหาก)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        # 'id', # อาจจะยังคงแสดง id ของ CartItem เองไว้ด้วย
        'cart_display',   # <--- เปลี่ยนชื่อ method ให้ชัดเจนขึ้น
        'sheet_display',  # <--- เปลี่ยนชื่อ method ให้ชัดเจนขึ้น
        # 'quantity',     # แสดงฟิลด์จำนวน ถ้ามี
        'create_date',  # แสดงฟิลด์ create_date
        'modify_date',  # แสดงฟิลด์ modify_date
    )

    # Method สำหรับแสดง Cart ID จาก ForeignKey
    def cart_display(self, obj): # <--- ใช้ชื่อ method ที่ใส่ใน list_display
    # obj.cart คือ Object ของ Model Cart ที่เชื่อมโยง
        return obj.cart.id if obj.cart else "-"
    cart_display.short_description = 'cart_id' # ตั้งชื่อหัวคอลัมน์

    # Method สำหรับแสดง Sheet ID จาก ForeignKey
    # แก้ parameter จาก idobj เป็น obj เหมือน method อื่นๆ
    def sheet_display(self, obj): # <--- ใช้ชื่อ method ที่ใส่ใน list_display และแก้ parameter
        # obj.sheet คือ Object ของ Model Sheet ที่เชื่อมโยง
        return obj.sheet.id if obj.sheet else "-"
    sheet_display.short_description = 'sheet_id' # ตั้งชื่อหัวคอลัมน์

    # หากต้องการ filter หรือ search
    # list_filter = ('cart', 'sheet') # ตัวอย่าง filter ตาม ForeignKey
    # search_fields = ('cart__id', 'sheet__id') # ตัวอย่าง search ตาม ID ของ ForeignKey

class OrderAdmin(admin.ModelAdmin):
    # กำหนดฟิลด์และ method ที่จะแสดงในหน้ารายการ Order
    list_display = (
        'order_id_display',    # Method สำหรับแสดง id เป็น order_id
        'get_user_id',         # Method สำหรับแสดง User ID
        'get_cart_id',         # Method สำหรับแสดง Cart ID
        'list_sheet_ids',      # Method สำหรับแสดงรายการ Sheet IDs ใน Order (เป็นข้อความ)
        'total_price_display', # Method สำหรับเปลี่ยนชื่อ total amount เป็น total_price
        'total_items_display', # Method เพื่อแสดง total_items
        'status_display',      # Method เพื่อแสดง status
        'create_date_display', # Method สำหรับเปลี่ยนชื่อ created at เป็น create_date
        'modify_date',         # แสดงฟิลด์ modify_date โดยตรง (ถ้ามีใน Model)
    )

    # ฟิลด์ที่ใช้ในการค้นหาในหน้ารายการ
    # *** ปรับ search_fields ให้ใช้ชื่อฟิลด์จริงที่มีใน Model Order ***
    search_fields = (
        'user__username', # ค้นหาตาม username ของ user ที่เชื่อมโยง (ถ้ามี ForeignKey user)
        'id',             # ค้นหาตาม Order ID
        'cart__id',       # ค้นหาตาม Cart ID (ถ้ามี ForeignKey cart)
        # 'items__sheet__id', # ถ้าต้องการค้นหาตาม Sheet ID ผ่าน OrderItem (อาจทำให้ช้า)
    )

    # ฟิลด์ที่ใช้ในการกรองในหน้ารายการ
    # *** ปรับ list_filter ให้ใช้ชื่อฟิลด์จริงที่มีใน Model Order ***
    list_filter = (
        'status',       # กรองตามสถานะของ Order (ต้องเป็นชื่อฟิลด์จริงใน Model)
        'created_at',   # กรองตามวันที่สร้าง (ต้องเป็นชื่อฟิลด์จริงใน Model)
        'user',         # กรองตาม User (ต้องเป็นชื่อฟิลด์ ForeignKey ใน Model)
        'modify_date',  # กรองตามวันที่แก้ไข (ต้องเป็นชื่อฟิลด์จริงใน Model)
    )

    # อาจจะเพิ่ม Inline เพื่อแสดงรายการ OrderItem ในหน้าแก้ไข Order
    # สมมติว่ามี OrderItemInline อยู่แล้ว และ Import มาแล้ว
    # inlines = [OrderItemInline]

    # --- Methods สำหรับแสดงผลตามที่ต้องการ ---

    # Method สำหรับแสดง id เป็น order_id
    def order_id_display(self, obj):
        return obj.id
    order_id_display.short_description = 'order_id'

    # Method สำหรับแสดง User ID
    # สมมติว่า Order Model มี ForeignKey ชื่อ 'user' ไปหา Model User
    def get_user_id(self, obj):
        # ตรวจสอบว่ามี user เชื่อมโยงหรือไม่
        return obj.user.id if hasattr(obj, 'user') and obj.user else "-"
    get_user_id.short_description = 'user_id'

    # Method สำหรับแสดง Cart ID
    # สมมติว่า Order Model มี ForeignKey หรือ OneToOneField ชื่อ 'cart' ไปหา Model Cart
    def get_cart_id(self, obj):
        # ตรวจสอบว่ามี cart เชื่อมโยงหรือไม่
        return obj.cart.id if hasattr(obj, 'cart') and obj.cart else "-"
    get_cart_id.short_description = 'cart_id'

    # Method สำหรับแสดงรายการ Sheet IDs ใน Order (เป็นข้อความ)
    # สมมติว่ามี Model OrderItem ที่มี ForeignKey ไป Order และ Sheet
    # และ related_name จาก Order ไป OrderItem คือ 'items' (หรือชื่ออื่น)
    def list_sheet_ids(self, obj):
        # ตรวจสอบว่ามี related manager ชื่อ 'items' และ Model OrderItem
        if hasattr(obj, 'items'):
            # ดึง Sheet ID จาก OrderItem ทั้งหมดที่เชื่อมโยง
            # กรองเฉพาะ item ที่มี sheet เชื่อมโยงอยู่
            sheet_ids = obj.items.filter(sheet__isnull=False).values_list('sheet__id', flat=True)
            return ", ".join(map(str, sheet_ids)) if sheet_ids else "-"
        return "-" # ถ้าไม่มี related manager หรือ OrderItem Model

    list_sheet_ids.short_description = 'sheet_ids' # หัวคอลัมน์

    # Method สำหรับแสดง total_price
    # *** ใช้ชื่อฟิลด์จริงใน Model Order ของคุณสำหรับ Total Amount/Price คือ 'total_amount' ***
    def total_price_display(self, obj):
        # ตรวจสอบว่าฟิลด์ total_amount มีอยู่จริงใน obj
        if hasattr(obj, 'total_amount'):
             return obj.total_amount
        return "-" # ถ้าฟิลด์ไม่มีอยู่จริง
    total_price_display.short_description = 'total_price'

    # Method สำหรับแสดง total_items
    # *** ใช้ชื่อฟิลด์จริงใน Model Order ของคุณสำหรับ Total Items คือ 'total_items' ***
    def total_items_display(self, obj):
         # ตรวจสอบว่าฟิลด์ total_items มีอยู่จริงใน obj
        if hasattr(obj, 'total_items'):
             return obj.total_items
        return "-"
    total_items_display.short_description = 'Total Items'


    # Method สำหรับแสดง status
    # *** ใช้ชื่อฟิลด์จริงใน Model Order ของคุณสำหรับ Status คือ 'status' ***
    def status_display(self, obj):
         # ตรวจสอบว่าฟิลด์ status มีอยู่จริงใน obj
        if hasattr(obj, 'status'):
             return obj.status
        return "-"
    status_display.short_description = 'Status'


    # Method สำหรับแสดง created_at (เปลี่ยนชื่อหัวคอลัมน์)
    # *** ใช้ชื่อฟิลด์จริงใน Model Order คือ 'created_at' ***
    def create_date_display(self, obj):
        # ตรวจสอบว่าฟิลด์ created_at มีอยู่จริงใน obj
        if hasattr(obj, 'created_at'):
            return obj.created_at
        return "-"
    create_date_display.short_description = 'create_date'

    # *** ฟิลด์ modify_date แสดงโดยตรงใน list_display แล้ว ***
    # ถ้าไม่มีฟิลด์ modify_date ใน Model และต้องการแสดง ก็ต้องเพิ่มใน models.py ก่อน


# ถ้าไม่ได้ใช้ @admin.register ให้ใช้บรรทัดนี้แทน
# admin.site.register(Order, OrderAdmin)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'sheet', 'quantity', 'price')
    list_filter = ('order__user', 'sheet__subject')
    search_fields = ('order__user__username', 'sheet__title', 'order__id')


# ModelAdmin สำหรับ Token ที่เราสร้างขึ้นเอง (ExpiringToken)
# ถ้าต้องการดู Token ที่มีในระบบ
class ExpiringTokenAdmin(admin.ModelAdmin):
    list_display = ('key', 'user', 'created') # key, user, created คือฟิลด์ที่มีใน Model

# ModelAdmin สำหรับ Subject
class SubjectAdmin(admin.ModelAdmin):
    # *** เพิ่ม 'id' เข้าไปใน list_display เพื่อให้แสดงคอลัมน์ ID ในหน้ารายการ ***
    list_display = ('id', 'name')
    # ฟิลด์ที่ใช้ในการค้นหา
    search_fields = ('name',)
    # ฟิลด์ที่ใช้ในการกรอง
    list_filter = ('name',) # อาจกรองด้วยชื่อ หรือฟิลด์อื่นที่เหมาะสม

# ModelAdmin สำหรับ Sheet
# class SheetAdmin(admin.ModelAdmin):
#     # *** เพิ่ม 'id' เข้าไปใน list_display เพื่อให้แสดงคอลัมน์ ID ในหน้ารายการ ***
#     # และเพิ่มฟิลด์อื่นๆ ที่ต้องการให้แสดงในหน้ารายการด้วย
#     list_display = ('sheet_id','subject_id', 'name', 'subject', 'subject_code', 'level', 'price','description','image','modify_date','create_date') # ตัวอย่างฟิลด์ที่น่าจะใช้บ่อยในรายการ
#     # ฟิลด์ที่ใช้ในการค้นหา
#     search_fields = ('name', 'subject_code', 'description') # ค้นหาจากชื่อชีท, รหัสวิชา, คำอธิบาย
#     # ฟิลด์ที่ใช้ในการกรอง
#     list_filter = ('subject', 'level') # กรองตามวิชา, ระดับ
#     # อาจเพิ่ม Inline ถ้ามี Model ย่อยที่เชื่อมโยงกับ Sheet และต้องการแสดงในหน้าแก้ไข Sheet
# # --- ลงทะเบียน Models กับ Admin Site ---

class SheetAdmin(admin.ModelAdmin):
    list_display = (
        'sheet_id', # เรียกใช้ method ที่เราจะสร้างเพื่อแสดง id เป็น sheet_id
        'name',
        'subject',
        'subject_id',       # เพิ่ม subject_id
        'subject_code',
        'level',
        'price',
        'create_date',
        'modify_date',      # เพิ่ม modify_date
        'display_image',    # เรียกใช้ method เพื่อแสดงรูปภาพ
        'description',      # เพิ่ม description
    )
    # สามารถเพิ่ม filter และ search fields ได้ตามต้องการ
    # list_filter = ('level', 'subject')
    # search_fields = ('name', 'subject_code')

    # Method สำหรับเปลี่ยนชื่อ id เป็น sheet_id ในการแสดงผล
    def sheet_id(self, obj):
        return obj.id
    sheet_id.short_description = 'sheet_id' # ตั้งชื่อหัวคอลัมน์

    # Method ใหม่สำหรับแสดง Subject ID
    def subject_id(self, obj):
        if obj.subject: # ตรวจสอบว่ามี subject เชื่อมโยงอยู่หรือไม่
            return obj.subject.id
        return "-" # แสดง "-" ถ้าไม่มี subject เชื่อมโยง
    subject_id.short_description = 'subject_id' # ตั้งชื่อหัวคอลัมน์
    
    # Method สำหรับแสดงผลรูปภาพ (สมมติว่าฟิลด์ image เป็น ImageField หรือ URLField)
    def display_image(self, obj):
        if obj.image:
            # หาก image เป็น URL
            # return format_html('<img src="{}" width="50" height="50" />', obj.image)
            # หาก image เป็น ImageField และคุณตั้งค่า MEDIA_URL ใน settings.py แล้ว
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "-" # แสดง "-" ถ้าไม่มีรูปภาพ
    display_image.short_description = 'image' # ตั้งชื่อหัวคอลัมน์



# ใช้ admin.site.register() คู่กับคลาส ModelAdmin ที่สร้างขึ้น
# ถ้าไม่มีคลาส ModelAdmin จะใช้การแสดงผล default
admin.site.register(Subject, SubjectAdmin) # ลงทะเบียน Subject กับ SubjectAdmin
admin.site.register(Sheet, SheetAdmin)     # ลงทะเบียน Sheet กับ SheetAdmin
admin.site.register(Cart, CartAdmin)      # ลงทะเบียน Cart กับ CartAdmin
# admin.site.register(CartItem, CartItemAdmin) # ลงทะเบียน CartItem ถ้าต้องการจัดการแยก
admin.site.register(Order, OrderAdmin)    # ลงทะเบียน Order กับ OrderAdmin
# admin.site.register(OrderItem, OrderItemAdmin) # ลงทะเบียน OrderItem ถ้าต้องการจัดการแยก
admin.site.register(ExpiringToken, ExpiringTokenAdmin) # ลงทะเบียน Custom Token Model



# ถ้าคุณต้องการลงทะเบียน Token มาตรฐานของ DRF ด้วย (ไม่น่าจะจำเป็นถ้าใช้ Custom Token อย่างเดียว)
# แต่ถ้าใช้ทั้งสองระบบ อาจจะต้องลงทะเบียน Token มาตรฐานด้วย
# from rest_framework.authtoken.models import Token as DefaultToken
# class DefaultTokenAdmin(admin.ModelAdmin):
#     list_display = ('key', 'user', 'created')
# admin.site.register(DefaultToken, DefaultTokenAdmin)

try:
    admin.site.unregister(User)
except admin.site.AlreadyRegistered:
    pass # ถ้ายังไม่ได้ลงทะเบียนก็ไม่มีปัญหา

# สร้าง ModelAdmin สำหรับ User โดยใช้ UserAdmin เป็นพื้นฐาน
class CustomUserAdmin(UserAdmin): # ตั้งชื่อต่างจาก SheetAdmin เพื่อไม่ให้สับสน
    list_display = (
        'user_id_display', # Method สำหรับแสดง id เป็น user_id
        'username',
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'date_joined', # แสดงวันที่สร้าง User (create_date)
        'last_login',  # แสดงวันที่ล็อกอินล่าสุด (คล้าย modify_date)
        # ห้ามเพิ่ม 'sheet_id', 'cart_id', 'order_id', 'password'
    )

    # Method สำหรับแสดง id เป็น user_id
    def user_id_display(self, obj):
        return obj.id
    user_id_display.short_description = 'user_id'

    # สามารถเพิ่ม list_filter หรือ search_fields ได้ ถ้าต้องการ
    # list_filter = UserAdmin.list_filter
    # search_fields = UserAdmin.search_fields

# ลงทะเบียน Model User มาตรฐาน ด้วย CustomUserAdmin ที่เราสร้าง
admin.site.register(User, CustomUserAdmin)