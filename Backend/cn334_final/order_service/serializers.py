# order_service/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from sheet_service.serializers import SheetSerializer # นำ SheetSerializer มาใช้

class OrderItemSerializer(serializers.ModelSerializer):
    sheet = SheetSerializer(read_only=True) # แสดงรายละเอียดของ Sheet ด้วย

    class Meta:
        model = OrderItem
        fields = ['id', 'sheet', 'quantity', 'price_at_purchase', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True) # แสดงรายการสินค้าใน Order
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'total_amount', 'status', 'order_date', 
            'contact_email', 'contact_tel', 'items'
        ]
        read_only_fields = ['user', 'total_amount', 'status', 'order_date']