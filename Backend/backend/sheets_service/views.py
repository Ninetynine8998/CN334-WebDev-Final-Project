# sheets_service/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .serializers import (
    RegisterSerializer, SubjectSerializer, SheetSerializer,
    CartSerializer, CartItemSerializer, OrderSerializer
)
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.serializers import AuthTokenSerializer # เพิ่มบรรทัดนี้
from rest_framework.authtoken.models import Token # ต้องมีบรรทัดนี้


from django.contrib.auth.models import User # นำเข้า User model สำหรับ Register
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Subject, Sheet, Cart, CartItem, Order, OrderItem,ExpiringToken 
from rest_framework.authtoken.views import ObtainAuthToken





# --- Views สำหรับการยืนยันตัวตน (Authentication) ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all() # ใช้ User model
    permission_classes = (AllowAny,) # อนุญาตให้ทุกคนเข้าถึงได้ (ไม่ต้องล็อกอิน)
    serializer_class = RegisterSerializer # ใช้ RegisterSerializer

    def create(self, request, *args, **kwargs):
        # ปรับการตอบกลับให้ตรงตามรูปแบบใน spec (status, message)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # ตรวจสอบข้อมูล ถ้าไม่ถูกต้องจะส่งข้อผิดพลาด
        self.perform_create(serializer) # ทำการสร้าง User
        headers = self.get_success_headers(serializer.data)
        return Response({'status': 'success', 'message': 'User registered successfully'}, status=status.HTTP_201_CREATED, headers=headers)

# class CustomAuthToken(ObtainAuthToken):
#     # ไม่ต้องระบุ serializer_class ตรงๆ แล้วก็ได้ ให้มันใช้ค่าเริ่มต้นไป
#     # serializer_class = AuthTokenSerializer

#     def post(self, request, *args, **kwargs):
#         # ใช้ standard serializer เพื่อตรวจสอบข้อมูลและยืนยันตัวตน
#         # ถ้าสำเร็จ validated_data จะมี 'user' (และควรจะมี 'token' แต่ในเคสของคุณมันไม่มี)
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True) # ถ้า Login ไม่สำเร็จ จะโยน exception

#         # ตอนนี้เรารู้ว่า 'user' มีอยู่ใน validated_data แน่ๆ ถ้ามาถึงตรงนี้
#         user = serializer.validated_data['user']

#         # --- ทำการสร้างหรือดึง Token ด้วยตัวเองสำหรับผู้ใช้ที่ยืนยันตัวตนได้แล้ว ---
#         # เรียกใช้ Token.objects.get_or_create
#         token, created = Token.objects.get_or_create(user=user)
#         # ----------------------------------------------------------------------

#         # สร้าง Response ในรูปแบบที่ต้องการ โดยใช้ token ที่ได้มาจากการ get_or_create
#         return Response({
#             'token': token.key, # ใช้ token.key เพื่อเอาค่า string ของ Token
#             'user_id': user.pk, # ใช้ user.pk เพื่อเอา User ID
#             'email': user.email, # ใช้ user.email เพื่อเอา Email (สมมติว่า User model มี field email)
#             'status': 'success',
#             'message': 'Login successful'
#         }, status=status.HTTP_200_OK)
        

class CustomAuthToken(ObtainAuthToken):
    # serializer_class อาจตั้งค่าหรือไม่ก็ได้
    # serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # --- DEBUG CODE: ลบ Token เก่าทั้งหมดของผู้ใช้นี้ แล้วสร้างใหม่ ---
        print(f"DEBUG Login: Attempting to delete existing tokens for user {user.username}")
        try:
            # ใช้ Custom Token Model manager ของคุณในการลบ
            deleted_count, _ = ExpiringToken.objects.filter(user=user).delete()
            print(f"DEBUG Login: Deleted {deleted_count} existing tokens for user {user.username}")
        except Exception as e:
             print(f"DEBUG Login: Error deleting existing token: {e}")

        # บังคับสร้าง Token ใหม่เสมอ
        # ใช้ Custom Token Model manager ของคุณในการสร้าง
        token = ExpiringToken.objects.create(user=user)
        print(f"DEBUG Login: New token created for user {user.username}: {token.key}")
        # --- END DEBUG CODE ---


        # Return custom response format โดยใช้ Token ที่เพิ่งสร้าง
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email, # สมมติ User model มี field email
            'status': 'success',
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
        
# เพิ่ม View สำหรับ Logout
# class LogoutView(APIView):
#     # กำหนดให้ต้องล็อกอิน (ส่ง Token ที่ถูกต้องและยังไม่หมดอายุ) ก่อนถึงจะ Logout ได้
#     permission_classes = (IsAuthenticated,)

#     def post(self, request, *args, **kwargs):
#         # request.user คือผู้ใช้ที่ล็อกอินอยู่ (ได้มาจาก Token ที่ส่งมา)
#         # request.user.auth_token คือ Token object ที่เชื่อมกับผู้ใช้คนนี้
#         # เนื่องจากเราใช้ Custom Token Model ที่สืบทอดจาก Token มาตรฐาน
#         # และตั้งค่า AUTH_TOKEN_MODEL ใน settings
#         # request.user.auth_token จะอ้างถึง object ของ Custom Token Model ของเรา
#         try:
#             # ลบ Token ที่เชื่อมกับผู้ใช้ที่ล็อกอินอยู่ออกจากฐานข้อมูล
#             # ใช้ request.user.auth_token.delete() หรือ Token.objects.get(user=request.user).delete()
#             request.user.auth_token.delete()
#             # หรือถ้าใช้ Custom Token Model ชื่อ ExpiringToken
#             # ExpiringToken.objects.get(user=request.user).delete()
#         except (Token.DoesNotExist, ExpiringToken.DoesNotExist):
#             # ถ้า Token หายไปแล้ว (อาจล็อกเอาท์ไปแล้ว หรือลบจากฐานข้อมูล)
#             pass # ไม่ต้องทำอะไรต่อ

#         # คืนค่า response ว่า Logout สำเร็จ
#         return Response({"status": "success", "message": "Successfully logged out."}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,) # <--- ต้องมี

    def post(self, request, *args, **kwargs):
        # ... โค้ดลบ Token ...
        try:
            # ใช้ request.user.auth_token.delete() หรือ ExpiringToken.objects.get(user=request.user).delete()
            # ... เลือกลบ Token ที่ถูกต้องตาม Custom Model ของคุณ ...
            pass # Placeholder

        except Exception: # จับ exception ที่อาจเกิดขึ้นในการลบ
             pass # ไม่ต้องทำอะไร ถ้าลบไม่ได้

        return Response({"status": "success", "message": "Successfully logged out."}, status=status.HTTP_200_OK)

# ... Views อื่นๆ ที่คุณสร้างไว้ ...


class AllSubjectsView(generics.ListAPIView):
    queryset = Subject.objects.all() # ดึงข้อมูล Subject ทั้งหมด
    serializer_class = SubjectSerializer
    permission_classes = (AllowAny,) # หรือ IsAuthenticated ถ้าต้องการให้ล็อกอินก่อนดูวิชา

    def list(self, request, *args, **kwargs):
        # ปรับการตอบกลับให้ตรงตามรูปแบบใน spec (subjects: array)
        response = super().list(request, *args, **kwargs)
        return Response({'subjects': response.data})

class SheetsBySubjectView(generics.ListAPIView):
    serializer_class = SheetSerializer
    permission_classes = (AllowAny,) # หรือ IsAuthenticated

    def get_queryset(self):
        # ดึงค่า subject_id จาก query parameters ใน URL (เช่น /select_sheet/?subject_id=1)
        subject_id = self.request.query_params.get('subject_id', None)
        if subject_id is not None:
            # ถ้ามี subject_id ให้กรอง Sheet ตาม subject_id นั้น
            return Sheet.objects.filter(subject_id=subject_id)
        return Sheet.objects.none() # ถ้าไม่มี subject_id ให้คืนค่าว่าง

    def list(self, request, *args, **kwargs):
        # ปรับการตอบกลับให้ตรงตามรูปแบบใน spec (sheet: array)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True) # ใช้ many=True เพราะคืนค่าเป็นรายการ (array)
        return Response({'sheet': serializer.data}) # ใช้ 'sheet' เป็น key ตาม spec

# --- View สำหรับรายละเอียด Sheet ---

class SheetDetailView(generics.RetrieveAPIView):
    queryset = Sheet.objects.all() # ดึง Sheet ทั้งหมด
    serializer_class = SheetSerializer
    permission_classes = (AllowAny,) # หรือ IsAuthenticated
    lookup_field = 'pk' # กำหนดฟิลด์ที่ใช้ในการค้นหา Object (ค่าเริ่มต้นคือ pk หรือ primary key)
                       # สมมติว่า sheet_id ใน spec หมายถึง primary key ของ Sheet

    def retrieve(self, request, *args, **kwargs):
        # ปรับการตอบกลับให้ตรงตามรูปแบบใน spec (sheet: object)
        instance = self.get_object() # ดึง Sheet object ตาม pk ที่ส่งมาใน URL
        serializer = self.get_serializer(instance)
        return Response({'sheet': serializer.data})

# --- Views สำหรับตะกร้า (Cart) ---

class AddToCartView(APIView):
    permission_classes = (IsAuthenticated,) # ต้องล็อกอินก่อนถึงจะเพิ่มสินค้าลงตะกร้าได้

    def post(self, request, *args, **kwargs):
        sheet_id = request.data.get('sheet_id') # ดึง sheet_id จาก body ของ request (เป็น int ตาม spec)
        if not sheet_id:
            # ตรวจสอบว่ามี sheet_id หรือไม่
            return Response({'status': 'error', 'message': 'sheet_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # ดึง Sheet object ถ้าไม่เจอให้คืนค่า 404
        sheet = get_object_or_404(Sheet, id=sheet_id)
        # ดึง Cart ของผู้ใช้ที่ล็อกอินอยู่ ถ้าไม่มีให้สร้างใหม่
        cart, created = Cart.objects.get_or_create(user=request.user)

        # ดึง CartItem สำหรับตะกร้านี้และ Sheet นี้ ถ้าไม่มีให้สร้างใหม่
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, sheet=sheet)

        if not item_created:
            # ถ้ามี CartItem อยู่แล้ว (ไม่ได้สร้างใหม่) ให้เพิ่มจำนวน quantity
            cart_item.quantity += 1
            cart_item.save() # บันทึกการเปลี่ยนแปลง

        # ส่ง status และ message ตาม spec
        return Response({'status': 'success', 'message': 'Item added to cart'}, status=status.HTTP_200_OK)

# class GetOrderView(generics.RetrieveAPIView): # เปลี่ยนชื่อจาก GetOrderView เพื่อสะท้อนว่าเป็นมุมมองสำหรับตะกร้า
#     serializer_class = CartSerializer
#     permission_classes = (IsAuthenticated,) # ต้องล็อกอินก่อนถึงจะดูตะกร้าได้
#     lookup_field = 'pk' # ใช้ pk สำหรับ cart_id ตาม spec

#     def get_queryset(self):
#         # ดึงเฉพาะ Cart ของผู้ใช้ที่ล็อกอินอยู่
#         return Cart.objects.filter(user=self.request.user)

#     def retrieve(self, request, *args, **kwargs):
#         # ดึง Cart object ตาม pk (cart_id) ที่ส่งมา และต้องเป็นของ user ที่ล็อกอินอยู่
#         cart_id = self.kwargs.get(self.lookup_field)
#         if cart_id:
#              cart = get_object_or_404(Cart, id=cart_id, user=request.user)
#         else:
#              # ถ้าไม่มี cart_id ใน URL (อาจจะต้องการดูตะกร้าปัจจุบันของผู้ใช้)
#              # ดึงหรือสร้างตะกร้าของผู้ใช้
#              cart, created = Cart.objects.get_or_create(user=request.user)

#         serializer = self.get_serializer(cart)
#         # คืนค่ารายการสินค้าในตะกร้า (items) ตาม spec ที่บอกว่า response เป็น sheet: object array
#         # Note: Spec response 'sheet': object array อาจจะสื่อถึงรายการของ CartItem objects
#         # ในที่นี้จะคืนค่า items ซึ่งเป็น array ของ CartItemSerialized data
#         return Response({'sheet': serializer.data['items']})

class GetOrderView(generics.RetrieveAPIView):
    serializer_class = CartSerializer # ใช้ CartSerializer
    permission_classes = (IsAuthenticated,) # ต้องล็อกอิน
    lookup_field = 'pk' # ใช้ pk ใน URL สำหรับ Cart ID

    # get_queryset จะใช้โดย get_object เพื่อจำกัดให้ค้นหาเฉพาะ Cart ของผู้ใช้ที่ล็อกอินอยู่
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        # get_object จะดึง Cart object ตาม pk (Cart ID) จาก URL
        # และใช้ get_queryset เพื่อให้แน่ใจว่า Cart นั้นเป็นของผู้ใช้ที่ล็อกอินอยู่
        instance = self.get_object()

        # สร้าง Serializer instance จาก Cart object
        serializer = self.get_serializer(instance)

        # --- DEBUG CODE: พิมพ์และคืนค่า serializer.data ทั้งหมด ---
        print("DEBUG: Cart Serializer Data:", serializer.data) # พิมพ์ใน Server Console
        # คืนค่าข้อมูลที่ Serialized ได้ทั้งหมดกลับไปใน Response
        return Response(serializer.data, status=status.HTTP_200_OK)
        # --- END DEBUG CODE ---

        # โค้ดเดิมที่ทำให้เกิด Error KeyError: 'items'
        # return Response({'sheet': serializer.data['items']})
        
class DeleteItemView(APIView):
    permission_classes = (IsAuthenticated,) # ต้องล็อกอินก่อนถึงจะลบสินค้าได้

    # ใช้ method DELETE ตาม spec
    def delete(self, request, *args, **kwargs):
        sheet_id = request.data.get('sheet_id') # ดึง sheet_id จาก body ของ request
        if not sheet_id:
             return Response({'status': 'error', 'message': 'sheet_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # ดึงตะกร้าของผู้ใช้ที่ล็อกอินอยู่
        cart = get_object_or_404(Cart, user=request.user)
        # ดึง CartItem ที่ต้องการลบในตะกร้านี้และสำหรับ Sheet นี้
        cart_item = get_object_or_404(CartItem, cart=cart, sheet_id=sheet_id)

        cart_item.delete() # ลบ CartItem

        # ส่ง status และ message ตาม spec
        return Response({'status': 'success', 'message': 'Item removed from cart'}, status=status.HTTP_200_OK)


# --- Views สำหรับออเดอร์ (Order) ---

# class ConfirmOrderView(APIView):
#     permission_classes = (IsAuthenticated,) # ต้องล็อกอินก่อนถึงจะยืนยันออเดอร์ได้

#     def post(self, request, *args, **kwargs):
#         # ดึงข้อมูล tel, email, cart_id จาก body ของ request
#         tel = request.data.get('tel')
#         email = request.data.get('email')
#         cart_id = request.data.get('cart_id') # สมมติว่าส่ง cart_id มาด้วย

#         # ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วนหรือไม่
#         if not all([tel, email, cart_id]):
#              return Response({'status': 'error', 'message': 'tel, email, and cart_id are required'}, status=status.HTTP_400_BAD_REQUEST)

#         # ดึงตะกร้าที่ต้องการยืนยัน และต้องเป็นของผู้ใช้ที่ล็อกอินอยู่
#         cart = get_object_or_404(Cart, id=cart_id, user=request.user)
#         cart_items = cart.cartitem_set.all() # ดึงรายการสินค้าในตะกร้านั้นทั้งหมด

#         # ตรวจสอบว่าตะกร้ามีสินค้าหรือไม่
#         if not cart_items:
#              return Response({'status': 'error', 'message': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

#         # สร้าง Order ใหม่
#         order = Order.objects.create(user=request.user, tel=tel, email=email)

#         # คัดลอกรายการสินค้าจากตะกร้ามาเป็นรายการสินค้าในออเดอร์
#         for item in cart_items:
#              OrderItem.objects.create(
#                 order=order,
#                 sheet=item.sheet,
#                 quantity=item.quantity,
#                 price=item.sheet.price # บันทึกราคา ณ เวลาที่สั่งซื้อ
#              )

#         cart_items.delete() # ล้างรายการสินค้าในตะกร้าหลังจากสร้างออเดอร์แล้ว

#         # ส่ง status และ message ตาม spec
#         return Response({'status': 'success', 'message': 'Order confirmed'}, status=status.HTTP_201_CREATED)

class ConfirmOrderView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        tel = request.data.get('tel')
        email = request.data.get('email')
        cart_id = request.data.get('cart_id')

        if not all([tel, email, cart_id]):
             return Response({'status': 'error', 'message': 'tel, email, and cart_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        # ดึง Cart object โดยใช้ Cart ID และต้องเป็นของผู้ใช้ที่ล็อกอินอยู่
        # ถ้าหาไม่เจอ get_object_or_404 จะคืนค่า 404 Not Found
        cart = get_object_or_404(Cart, id=cart_id, user=request.user)

        # --- บรรทัดที่แก้ไข: เปลี่ยน cart.cartitem_set.all() เป็น cart.items.all() ---
        cart_items = cart.items.all() # ใช้ชื่อ Related Manager ใหม่ 'items'
        # ---------------------------------------------------------------------

        if not cart_items:
             return Response({'status': 'error', 'message': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # สร้าง Order ใหม่
        order = Order.objects.create(user=request.user, tel=tel, email=email)

        # คัดลอกรายการสินค้าจากตะกร้ามาเป็นรายการสินค้าในออเดอร์
        for item in cart_items:
             OrderItem.objects.create(
                order=order,
                sheet=item.sheet,
                quantity=item.quantity,
                price=item.sheet.price # บันทึกราคา ณ เวลาที่สั่งซื้อ
             )

        # ล้างรายการสินค้าในตะกร้าหลังจากสร้างออเดอร์แล้ว (ลบ CartItem objects)
        cart_items.delete()

        # คืนค่า response ว่ายืนยันออเดอร์สำเร็จ
        return Response({'status': 'success', 'message': 'Order confirmed'}, status=status.HTTP_201_CREATED)


# --- View สำหรับ Dashboard ---

class DashboardView(APIView):
     permission_classes = (IsAuthenticated,) # ต้องล็อกอินก่อนถึงจะเข้าถึง Dashboard ได้

     def post(self, request, *args, **kwargs):
        # ข้อกำหนดสำหรับ Dashboard ค่อนข้างกำกวม
        # สมมติว่ามันคือการดึงชีทที่เกี่ยวข้องกับผู้ใช้ (เช่น ชีทที่เคยซื้อ)
        # คุณจะต้องกำหนดวิธีการเชื่อมโยงชีทกับผู้ใช้บน Dashboard ของคุณ
        # สำหรับตัวอย่างนี้ จะสมมติว่าเป็นการดึงชีทที่ผู้ใช้เคยสั่งซื้อ

        user = request.user
        # ดึงรายการสินค้าในออเดอร์ทั้งหมดของผู้ใช้
        ordered_items = OrderItem.objects.filter(order__user=user)
        # ดึง id ของ Sheet ทั้งหมดที่อยู่ในรายการที่สั่งซื้อ (ให้ไม่ซ้ำกัน)
        sheet_ids = ordered_items.values_list('sheet_id', flat=True).distinct()
        # ดึง Sheet objects ตาม id ที่ได้มา
        sheets = Sheet.objects.filter(id__in=sheet_ids)

        # Serialized รายการ Sheet
        serializer = SheetSerializer(sheets, many=True)

        # ข้อกำหนด response คือ 'sheet_id': object(int) ซึ่งดูไม่ถูกต้องสำหรับรายการของ Sheets
        # จะคืนค่า serialized sheet objects แทน คุณสามารถปรับเปลี่ยนได้ตามต้องการ
        return Response({'sheets': serializer.data}) # เปลี่ยนเป็น 'sheets' เพื่อให้สื่อว่าเป็นรายการ
    
    
    
# # เพิ่ม View สำหรับ Logout
# class LogoutView(APIView):
#     # กำหนดให้ต้องล็อกอิน (ส่ง Token ที่ถูกต้องและยังไม่หมดอายุ) ก่อนถึงจะ Logout ได้
#     permission_classes = (IsAuthenticated,)

#     def post(self, request, *args, **kwargs):
#         # request.user คือผู้ใช้ที่ล็อกอินอยู่ (ได้มาจาก Token ที่ส่งมา)
#         # request.user.auth_token คือ Token object ที่เชื่อมกับผู้ใช้คนนี้
#         # เนื่องจากเราใช้ Custom Token Model ที่สืบทอดจาก Token มาตรฐาน
#         # และตั้งค่า AUTH_TOKEN_MODEL ใน settings
#         # request.user.auth_token จะอ้างถึง object ของ Custom Token Model ของเรา
#         try:
#             # ลบ Token ที่เชื่อมกับผู้ใช้ที่ล็อกอินอยู่ออกจากฐานข้อมูล
#             # ใช้ request.user.auth_token.delete() หรือ Token.objects.get(user=request.user).delete()
#             request.user.auth_token.delete()
#             # หรือถ้าใช้ Custom Token Model ชื่อ ExpiringToken
#             # ExpiringToken.objects.get(user=request.user).delete()
#         except (Token.DoesNotExist, ExpiringToken.DoesNotExist):
#             # ถ้า Token หายไปแล้ว (อาจล็อกเอาท์ไปแล้ว หรือลบจากฐานข้อมูล)
#             pass # ไม่ต้องทำอะไรต่อ

#         # คืนค่า response ว่า Logout สำเร็จ
#         return Response({"status": "success", "message": "Successfully logged out."}, status=status.HTTP_200_OK)
class OrderDetailView(generics.RetrieveAPIView):
    # กำหนด Queryset หลัก: ดึง Order ทั้งหมด
    queryset = Order.objects.all()
    # กำหนด Serializer ที่จะใช้: ใช้ OrderSerializer ที่เราปรับปรุงแล้ว
    serializer_class = OrderSerializer
    # กำหนด Permission: ต้องล็อกอินก่อนถึงจะดูได้
    permission_classes = (IsAuthenticated,)
    # กำหนดฟิลด์ใน URL ที่ใช้ค้นหา Object (Default คือ 'pk')
    # เราจะใช้ Order ID ใน URL ซึ่งตรงกับ Primary Key ของ Order Model
    lookup_field = 'pk'

    # Override get_queryset เพื่อจำกัดให้ผู้ใช้ดูได้เฉพาะ Order ของตัวเองเท่านั้น
    def get_queryset(self):
        # ดึง Queryset หลัก (Order ทั้งหมด) แล้วกรองเฉพาะ Order ที่เชื่อมกับผู้ใช้ที่ล็อกอินอยู่
        return super().get_queryset().filter(user=self.request.user)

    # ไม่จำเป็นต้อง Override retrieve method ถ้าต้องการแค่คืนค่า Object เดียว
    # Generic RetrieveAPIView จะจัดการให้โดยอัตโนมัติ โดยใช้ get_object() และ serializer_class