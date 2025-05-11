# sheets_service/serializers.py
from rest_framework import serializers
from .models import Subject, Sheet, Cart, CartItem, Order, OrderItem
from django.contrib.auth import get_user_model # <-- แก้ไขเป็นบรรทัดนี้

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email') # เพิ่มฟิลด์อื่นๆ ตามต้องการ

User = get_user_model() # ดึง User Model มาใช้งาน

# Serializer สำหรับ User (ใช้เมื่อต้องการแสดงรายละเอียด User ที่ถูก Nested)
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email') # ระบุฟิลด์ผู้ใช้ที่ต้องการให้แสดงเมื่อถูก Nested
#         # อาจเพิ่ม 'first_name', 'last_name' ถ้ามีใน User model และต้องการแสดง
# Serializer สำหรับ User
class UserSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = User
        fields = ('user_id', 'username', 'email', 'last_login', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) 
    confirm_password = serializers.CharField(write_only=True) 

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.") 
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data) 
        return user

class SubjectSerializer(serializers.ModelSerializer):
    subject_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = Subject
        fields = ('subject_id', 'name') 

class SheetSerializer(serializers.ModelSerializer):
    sheet_id = serializers.IntegerField(source='id', read_only=True)
    subject = SubjectSerializer(read_only=True)
    class Meta:
        model = Sheet
        fields = (
            'sheet_id', 'subject', 'title', 'subject_code', 'level',
            'price', 'description', 'image', 'modify_date', 'create_date'
        ) 

class CartItemSerializer(serializers.ModelSerializer):
    cart_item_id = serializers.IntegerField(source='id', read_only=True)
    sheet = SheetSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = ('cart_item_id', 'cart', 'sheet', 'quantity') # 'cart' ในที่นี้ยังคงเป็น FK ชี้ไปที่ Cart

# class CartSerializer(serializers.ModelSerializer):
#     items = CartItemSerializer(many=True, read_only=True) # แสดงรายการสินค้าในตะกร้า (หลายรายการ) แบบอ่านอย่างเดียว

#     class Meta:
#         model = Cart
#         fields = ('id', 'user', 'items')

# Serializer สำหรับ Cart
class CartSerializer(serializers.ModelSerializer):
    cart_id = serializers.IntegerField(source='id', read_only=True)
    user = UserSerializer(read_only=True)
    items = CartItemSerializer(many=True, read_only=True) 

    class Meta:
        model = Cart
        fields = ('cart_id', 'user', 'items', 'modify_date', 'create_date')        
# class OrderItemSerializer(serializers.ModelSerializer):
#      sheet = SheetSerializer(read_only=True) # แสดงรายละเอียด Sheet แบบอ่านอย่างเดียว

#      class Meta:
#          model = OrderItem
#          fields = '__all__' # แสดงทุกฟิลด์ในโมเดล OrderItem

# Serializer สำหรับ OrderItem
class OrderItemSerializer(serializers.ModelSerializer):
    order_item_id = serializers.IntegerField(source='id', read_only=True)
    sheet = SheetSerializer(read_only=True)

    class Meta:
         model = OrderItem
         fields = ('order_item_id', 'order', 'sheet', 'quantity', 'price') 

# class OrderSerializer(serializers.ModelSerializer):
#     items = OrderItemSerializer(many=True, read_only=True) # แสดงรายการสินค้าในออเดอร์ (หลายรายการ) แบบอ่านอย่างเดียว

#     class Meta:
#         model = Order
#         fields = '__all__' # แสดงทุกฟิลด์ในโมเดล Order

# Serializer สำหรับ Order
class OrderSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='id', read_only=True)
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set') 


    class Meta:
        model = Order
        fields = ('order_id', 'user', 'tel', 'email', 'created_at', 'items')
        