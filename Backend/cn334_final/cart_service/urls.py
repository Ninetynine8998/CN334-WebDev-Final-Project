# cart_service/urls.py
from django.urls import path
from .views import AddToCartView, ViewCartView, RemoveFromCartView

urlpatterns = [
    path('add_to_cart/', AddToCartView.as_view(), name='add_to_cart'),
    path('view_cart/', ViewCartView.as_view(), name='view_cart'), # เพิ่ม endpoint สำหรับดูตะกร้า
    path('delete/item/', RemoveFromCartView.as_view(), name='remove_cart_item'), # เปลี่ยน path ตรงนี้

]