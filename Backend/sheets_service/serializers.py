# sheets_service/serializers.py
from rest_framework import serializers
from .models import Subject, Sheet, Cart, CartItem, Order, OrderItem
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email') # เพิ่มฟิลด์อื่นๆ ตามต้องการ

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # ฟิลด์นี้ใช้สำหรับการเขียนเท่านั้น ไม่แสดงตอนอ่าน
    confirm_password = serializers.CharField(write_only=True) # ฟิลด์นี้ใช้สำหรับการเขียนเท่านั้น ไม่แสดงตอนอ่าน

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        # ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.") # รหัสผ่านไม่ตรงกัน
        return data

    def create(self, validated_data):
        # ลบ confirm_password ออกก่อนสร้าง User
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data) # สร้าง User ด้วยข้อมูลที่ผ่านการตรวจสอบแล้ว
        return user

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__' # แสดงทุกฟิลด์ในโมเดล Subject

class SheetSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True) # แสดงรายละเอียด Subject แบบอ่านอย่างเดียว

    class Meta:
        model = Sheet
        fields = '__all__' # แสดงทุกฟิลด์ในโมเดล Sheet

class CartItemSerializer(serializers.ModelSerializer):
    sheet = SheetSerializer(read_only=True) # แสดงรายละเอียด Sheet แบบอ่านอย่างเดียว

    class Meta:
        model = CartItem
        fields = '__all__' # แสดงทุกฟิลด์ในโมเดล CartItem

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True) # แสดงรายการสินค้าในตะกร้า (หลายรายการ) แบบอ่านอย่างเดียว

    class Meta:
        model = Cart
        fields = ('id', 'user', 'items')

class OrderItemSerializer(serializers.ModelSerializer):
     sheet = SheetSerializer(read_only=True) # แสดงรายละเอียด Sheet แบบอ่านอย่างเดียว

     class Meta:
         model = OrderItem
         fields = '__all__' # แสดงทุกฟิลด์ในโมเดล OrderItem

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True) # แสดงรายการสินค้าในออเดอร์ (หลายรายการ) แบบอ่านอย่างเดียว

    class Meta:
        model = Order
        fields = '__all__' # แสดงทุกฟิลด์ในโมเดล Order