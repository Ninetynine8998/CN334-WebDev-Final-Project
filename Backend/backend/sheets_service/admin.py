# sheets_service/admin.py
from django.contrib import admin
# นำเข้า Models ทั้งหมดที่เราต้องการจัดการผ่าน Admin
from .models import Subject, Sheet, Cart, CartItem, Order, OrderItem, ExpiringToken
from rest_framework.authtoken.models import Token as DefaultToken # นำเข้า Token มาตรฐานเพื่อลงทะเบียนด้วย ถ้าจำเป็น
# # ลงทะเบียน Models ใน Admin Site
# admin.site.register(Subject)
# admin.site.register(Sheet)
# admin.site.register(Cart) # <-- เพิ่มบรรทัดนี้เพื่อลงทะเบียน Model Cart

# # คุณสามารถลงทะเบียน Model อื่นๆ ที่คุณต้องการจัดการผ่าน Admin ได้เช่นกัน
# # admin.site.register(Cart)
# # admin.site.register(CartItem)
# # admin.site.register(Order)
# # admin.site.register(OrderItem)

# sheets_service/admin.py


# --- Inline Models (สำหรับแสดงรายการย่อยในหน้าหลัก) ---

# Inline สำหรับแสดงรายการ CartItem ในหน้าแก้ไข Cart
class CartItemInline(admin.TabularInline): # หรือ admin.StackedInline สำหรับรูปแบบที่แตกต่าง
    model = CartItem
    extra = 0 # ไม่แสดงฟอร์มว่างเพิ่มเติมตอนแรก
    # หากต้องการกำหนดฟิลด์ที่จะแสดงใน Inline
    fields = ('id','sheet', 'quantity')
    readonly_fields = ('sheet',) # อาจทำให้ sheet อ่านอย่างเดียวหลังสร้าง


# Inline สำหรับแสดงรายการ OrderItem ในหน้าแก้ไข Order
class OrderItemInline(admin.TabularInline): # หรือ admin.StackedInline
    model = OrderItem
    extra = 0
    # หากต้องการกำหนดฟิลด์ที่จะแสดงใน Inline
    fields = ('id','sheet', 'quantity', 'price')
    readonly_fields = ('sheet', 'price') # อาจทำให้ sheet, price อ่านอย่างเดียว


# --- ModelAdmin (สำหรับการปรับแต่งการแสดงผลใน Admin) ---

# ModelAdmin สำหรับ Cart
class CartAdmin(admin.ModelAdmin):
    # ฟิลด์ที่จะแสดงในหน้ารายการ Cart
    list_display = ('id', 'user', 'get_total_items') # เพิ่ม method get_total_items
    # ฟิลด์ที่ใช้ในการค้นหาในหน้ารายการ
    search_fields = ('user__username',)
    # ฟิลด์ที่ใช้ในการกรองในหน้ารายการ
    list_filter = ('user',)
    # เพิ่ม Inline เพื่อแสดงรายการ CartItem ในหน้าแก้ไข Cart
    inlines = [CartItemInline]

    # เพิ่ม method เพื่อคำนวณจำนวนสินค้ารวมในตะกร้าสำหรับแสดงใน list_display
    def get_total_items(self, obj):
        return obj.items.count() # ใช้ related_name 'items' ที่เรากำหนดไว้ใน CartItem model
    get_total_items.short_description = 'Total Items' # ชื่อคอลัมน์ใน Admin

# ModelAdmin สำหรับ CartItem (ถ้าต้องการจัดการ CartItem แยกต่างหาก)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'sheet', 'quantity')
    list_filter = ('cart__user', 'sheet__subject')
    search_fields = ('cart__user__username', 'sheet__title')


# ModelAdmin สำหรับ Order
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'tel', 'email', 'get_total_amount', 'get_total_items', 'created_at') # เพิ่ม created_at ถ้ามีใน Model
    search_fields = ('user__username', 'tel', 'email')
    list_filter = ('user',)
    # เพิ่ม Inline เพื่อแสดงรายการ OrderItem ในหน้าแก้ไข Order
    inlines = [OrderItemInline]

    # เพิ่ม method เพื่อคำนวณยอดรวมของออเดอร์
    def get_total_amount(self, obj):
        # อาจต้องเพิ่มฟิลด์ total_amount ใน Order Model หรือคำนวณจาก OrderItem ทั้งหมด
        # ตัวอย่างการคำนวณจาก OrderItem (ถ้าไม่มีฟิลด์ total_amount ใน Order)
        return sum(item.quantity * item.price for item in obj.orderitem_set.all()) # ใช้ default related_name orderitem_set
    get_total_amount.short_description = 'Total Amount'

    # เพิ่ม method เพื่อคำนวณจำนวนสินค้ารวมในออเดอร์
    def get_total_items(self, obj):
         return sum(item.quantity for item in obj.orderitem_set.all()) # ใช้ default related_name orderitem_set
    get_total_items.short_description = 'Total Items'

# ModelAdmin สำหรับ OrderItem (ถ้าต้องการจัดการ OrderItem แยกต่างหาก)
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
class SheetAdmin(admin.ModelAdmin):
    # *** เพิ่ม 'id' เข้าไปใน list_display เพื่อให้แสดงคอลัมน์ ID ในหน้ารายการ ***
    # และเพิ่มฟิลด์อื่นๆ ที่ต้องการให้แสดงในหน้ารายการด้วย
    list_display = ('id', 'title', 'subject', 'subject_code', 'level', 'price', 'create_date') # ตัวอย่างฟิลด์ที่น่าจะใช้บ่อยในรายการ
    # ฟิลด์ที่ใช้ในการค้นหา
    search_fields = ('title', 'subject_code', 'description') # ค้นหาจากชื่อชีท, รหัสวิชา, คำอธิบาย
    # ฟิลด์ที่ใช้ในการกรอง
    list_filter = ('subject', 'level') # กรองตามวิชา, ระดับ
    # อาจเพิ่ม Inline ถ้ามี Model ย่อยที่เชื่อมโยงกับ Sheet และต้องการแสดงในหน้าแก้ไข Sheet
# --- ลงทะเบียน Models กับ Admin Site ---

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