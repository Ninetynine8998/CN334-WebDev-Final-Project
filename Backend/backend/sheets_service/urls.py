# sheets_service/urls.py
from django.urls import path
from .views import (
    RegisterView, CustomAuthToken, AllSubjectsView, SheetsBySubjectView,
    SheetDetailView, AddToCartView, GetOrderView, DeleteItemView,
    ConfirmOrderView, DashboardView, LogoutView, OrderDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'), # สำหรับ Register
    path('login/', CustomAuthToken.as_view(), name='login'), # สำหรับ Login
    path('_all_subject/', AllSubjectsView.as_view(), name='all_subjects'), # ดึงวิชาทั้งหมด
    path('select_sheet/', SheetsBySubjectView.as_view(), name='select_sheet_by_subject'), # ดึงชีทตาม subject_id
    path('sheet_detail/<int:pk>/', SheetDetailView.as_view(), name='sheet_detail'), # ดึงรายละเอียดชีท ใช้ pk เป็น sheet_id
    path('add_to_cart/', AddToCartView.as_view(), name='add_to_cart'), # เพิ่มลงตะกร้า
    path('view_cart/<int:pk>/', GetOrderView.as_view(), name='view_cart'), # ดึงรายการในตะกร้า ใช้ pk เป็น cart_id
    path('delete_item/', DeleteItemView.as_view(), name='delete_item'), # ลบรายการในตะกร้า
    path('confirm_order/', ConfirmOrderView.as_view(), name='confirm_order'), # ยืนยันออเดอร์ (Checkout)
    path('dashboard/', DashboardView.as_view(), name='dashboard'), # Dashboard
    path('logout/', LogoutView.as_view(), name='logout'), # เพิ่ม URL สำหรับ Logout
    path('order/<int:pk>/', OrderDetailView.as_view(), name='order_detail'), # ใช้ pk สำหรับ order_id

]