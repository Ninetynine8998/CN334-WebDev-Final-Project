# cart_service/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated # เพื่อบังคับให้ผู้ใช้ต้องล็อกอิน

from .models import Cart, CartItem
from sheet_service.models import Sheet # นำ Sheet Model มาใช้
from .serializers import CartSerializer, CartItemSerializer


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated] # กำหนดให้ View นี้ต้องมีการยืนยันตัวตน

    def post(self, request):
        sheet_id = request.data.get('sheet_id')
        quantity = request.data.get('quantity', 1) # Default quantity is 1

        if not sheet_id:
            return Response({'error': 'sheet_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            sheet = Sheet.objects.get(id=sheet_id)
        except Sheet.DoesNotExist:
            return Response({'error': 'Sheet not found'}, status=status.HTTP_404_NOT_FOUND)

        if not isinstance(quantity, int) or quantity <= 0:
            return Response({'error': 'quantity must be a positive integer'}, status=status.HTTP_400_BAD_REQUEST)

        # ดึงตะกร้าสินค้าของผู้ใช้ปัจจุบัน หรือสร้างใหม่ถ้ายังไม่มี
        cart, created = Cart.objects.get_or_create(user=request.user)

        # ตรวจสอบว่าชีทนี้มีอยู่ในตะกร้าแล้วหรือไม่
        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart, 
            sheet=sheet,
            defaults={'quantity': quantity, 'price_at_addition': sheet.price}
        )

        if not item_created:
            # ถ้ามีอยู่แล้ว ให้อัปเดตจำนวน
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartSerializer(cart) # ส่งข้อมูลตะกร้าทั้งหมดกลับไป
        return Response({'message': 'Sheet added to cart successfully.', 'cart': serializer.data}, status=status.HTTP_200_OK)

class ViewCartView(APIView):
    permission_classes = [IsAuthenticated] # กำหนดให้ View นี้ต้องมีการยืนยันตัวตน

    def get(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            serializer = CartSerializer(cart) # ใช้ CartSerializer เพื่อแปลง Cart object เป็น JSON
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            # หากผู้ใช้ยังไม่มีตะกร้า ก็ส่งข้อความว่าตะกร้าว่างเปล่า
            return Response({'message': 'Cart is empty or does not exist.'}, status=status.HTTP_200_OK)
        
class RemoveFromCartView(APIView):
    """
    API endpoint สำหรับลบสินค้าออกจากตะกร้าของผู้ใช้
    - ต้องมีการยืนยันตัวตน (Authentication)
    - รับ sheet_id หรือ cart_item_id ใน Request Body (JSON)
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        sheet_id = request.data.get('sheet_id')
        cart_item_id = request.data.get('cart_item_id') # อีกทางเลือก: ระบุ ID ของ CartItem โดยตรง

        if not sheet_id and not cart_item_id:
            return Response(
                {'error': 'Either sheet_id or cart_item_id is required to remove an item.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            # ถ้าตะกร้าไม่พบสำหรับผู้ใช้นี้ แสดงว่าไม่มีอะไรให้ลบ
            return Response({'error': 'Cart does not exist for this user.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            if sheet_id:
                # ค้นหา CartItem โดยใช้ cart และ sheet_id
                cart_item = CartItem.objects.get(cart=cart, sheet__id=sheet_id)
            elif cart_item_id:
                # ค้นหา CartItem โดยใช้ cart และ cart_item_id โดยตรง
                cart_item = CartItem.objects.get(cart=cart, id=cart_item_id)
            else:
                # กรณีที่ sheet_id และ cart_item_id ไม่ถูกระบุมา (ควรถูกจับโดยเงื่อนไขด้านบนแล้ว)
                return Response({'error': 'Invalid request. Please specify sheet_id or cart_item_id.'}, status=status.HTTP_400_BAD_REQUEST)

            cart_item.delete() # ลบ CartItem ออกจากฐานข้อมูล
            
            # (ทางเลือก) ส่งข้อมูลตะกร้าที่อัปเดตแล้วกลับไป
            serializer = CartSerializer(cart)
            return Response(
                {'message': 'Item removed from cart successfully.', 'cart': serializer.data},
                status=status.HTTP_200_OK
            )

        except CartItem.DoesNotExist:
            # ถ้าไม่พบ CartItem ที่ระบุในตะกร้านี้
            return Response({'error': 'Item not found in cart.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # กรณีเกิดข้อผิดพลาดที่ไม่คาดคิด
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)