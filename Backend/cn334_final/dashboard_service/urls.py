# dashboard_service/urls.py
from django.urls import path
from .views import MyPurchasedSheetsDashboardView

urlpatterns = [
    path('my_purchased_sheets/', MyPurchasedSheetsDashboardView.as_view(), name='my_purchased_sheets_dashboard'),
    # ถ้าคุณต้องการ endpoint สำหรับ search หรืออื่นๆ อาจเพิ่มที่นี่
    # path('search_sheets/', SearchSheetsView.as_view(), name='search_sheets'),
]