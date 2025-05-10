# order_service/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction # สำหรับการทำ Transaction

from .models import Order, OrderItem
from cart_service.models import Cart, CartItem # นำ Cart และ CartItem มาใช้
from .serializers import OrderSerializer


class ConfirmOrderView(APIView):
    """
    API endpoint สำหรับการยืนยันคำสั่งซื้อ (Checkout)
    - ต้องมีการยืนยันตัวตน (Authentication)
    - รับ tel, email, cart_id ใน Request Body (JSON)
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        contact_tel = request.data.get('tel')
        contact_email = request.data.get('email')
        cart_id = request.data.get('cart_id')

        # 1. Validate Input
        if not all([contact_tel, contact_email, cart_id]):
            return Response(
                {'error': 'tel, email, and cart_id are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart_id = int(cart_id)
        except ValueError:
            return Response({'error': 'cart_id must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 2. ดึง Cart และ CartItems ที่ถูกต้อง
            # สำคัญ: ตรวจสอบว่า cart_id ที่ส่งมานั้นเป็นของ request.user เพื่อความปลอดภัย
            cart = Cart.objects.get(id=cart_id, user=request.user)
            cart_items = cart.items.all()

            if not cart_items.exists():
                return Response({'error': 'Cart is empty. Cannot confirm an empty order.'}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = sum(item.subtotal for item in cart_items)

            # ใช้ transaction.atomic เพื่อให้แน่ใจว่าทุกอย่างสำเร็จ หรือ Rollback ทั้งหมดหากมีข้อผิดพลาด
            with transaction.atomic():
                # 3. สร้าง Order
                order = Order.objects.create(
                    user=request.user,
                    total_amount=total_amount,
                    contact_tel=contact_tel,
                    contact_email=contact_email,
                    status='pending' # กำหนดสถานะเริ่มต้น
                )

                # 4. สร้าง OrderItems จาก CartItems
                order_items_to_create = []
                for cart_item in cart_items:
                    # (ในสถานการณ์จริง อาจจะต้องตรวจสอบ Stock ที่นี่)
                    order_items_to_create.append(
                        OrderItem(
                            order=order,
                            sheet=cart_item.sheet,
                            quantity=cart_item.quantity,
                            price_at_purchase=cart_item.price_at_addition # ใช้ราคา ณ เวลาที่เพิ่มลงตะกร้า
                        )
                    )
                OrderItem.objects.bulk_create(order_items_to_create)

                # 5. ล้างตะกร้าสินค้าหลังจากสร้าง Order สำเร็จ
                cart_items.delete() # ลบ CartItems ทั้งหมดออกจากตะกร้า

            # 6. ตอบกลับด้วยข้อมูล Order ที่สร้างขึ้น
            serializer = OrderSerializer(order)
            return Response(
                {'message': 'Order confirmed successfully.', 'order': serializer.data},
                status=status.HTTP_201_CREATED
            )

        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found or does not belong to this user.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # จัดการข้อผิดพลาดทั่วไป
            return Response({'error': f'An unexpected error occurred during order confirmation: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)