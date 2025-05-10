# dashboard_service/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated # ต้องมีการยืนยันตัวตน

from order_service.models import Order, OrderItem # นำ Order และ OrderItem มาใช้
from sheet_service.serializers import SheetSerializer # นำ SheetSerializer มาใช้


class MyPurchasedSheetsDashboardView(APIView):
    """
    API endpoint สำหรับแสดงชีทที่ผู้ใช้ปัจจุบันได้สั่งซื้อสำเร็จแล้วบน Dashboard
    - Method: GET (แนะนำ)
    - Path: /api/dashboard/my_purchased_sheets/
    - ต้องมีการยืนยันตัวตน (Authentication)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user # ดึงผู้ใช้ที่ล็อกอินอยู่

        try:
            # ดึงคำสั่งซื้อทั้งหมดของผู้ใช้ที่มีสถานะ 'delivered' หรือ 'completed'
            # (คุณสามารถปรับสถานะได้ตามที่คุณกำหนดใน Order model)
            purchased_orders = Order.objects.filter(user=user, status='delivered')
            
            # ดึงรายการสินค้าทั้งหมดจากคำสั่งซื้อเหล่านี้
            order_items = OrderItem.objects.filter(order__in=purchased_orders)
            
            # ดึง Sheet object ที่ไม่ซ้ำกันจากรายการสินค้าที่ซื้อ
            # ใช้ .distinct() เพื่อให้ได้ Sheet object ที่ไม่ซ้ำกัน
            # ใช้ select_related('sheet') เพื่อลดจำนวน Query (N+1 problem)
            purchased_sheets = Sheet.objects.filter(
                id__in=order_items.values_list('sheet__id', flat=True)
            ).distinct()

            # แปลง Sheet object เป็น JSON
            serializer = SheetSerializer(purchased_sheets, many=True)
            
            return Response({
                'username': user.username, # แสดงชื่อผู้ใช้
                'sheets': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'An unexpected error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )