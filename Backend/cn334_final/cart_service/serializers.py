# cart_service/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem
from sheet_service.serializers import SheetSerializer # นำ SheetSerializer ที่มีอยู่แล้วมาใช้


class CartItemSerializer(serializers.ModelSerializer):
    sheet = SheetSerializer(read_only=True) # แสดงรายละเอียดของ Sheet ด้วย
    sheet_id = serializers.IntegerField(write_only=True) # สำหรับการรับค่า sheet_id เมื่อสร้าง/อัปเดต

    class Meta:
        model = CartItem
        fields = ['id', 'sheet', 'sheet_id', 'quantity', 'price_at_addition', 'subtotal']
        read_only_fields = ['price_at_addition', 'subtotal'] # ราคาจะถูกกำหนดโดย View

    def create(self, validated_data):
        # เมื่อสร้าง CartItem ให้กำหนด price_at_addition จาก Sheet ที่เกี่ยวข้อง
        sheet_id = validated_data.pop('sheet_id')
        try:
            sheet = Sheet.objects.get(id=sheet_id)
        except Sheet.DoesNotExist:
            raise serializers.ValidationError("Sheet not found.")

        validated_data['sheet'] = sheet
        validated_data['price_at_addition'] = sheet.price # ใช้ราคาปัจจุบันของชีท
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # เมื่ออัปเดต CartItem (เช่น เปลี่ยน quantity)
        # price_at_addition จะไม่ถูกอัปเดต เพราะเราต้องการราคา ณ เวลาที่เพิ่ม
        if 'sheet_id' in validated_data:
            raise serializers.ValidationError("Cannot change sheet_id for an existing cart item.")
        return super().update(instance, validated_data)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True) # แสดงรายการสินค้าในตะกร้า
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']