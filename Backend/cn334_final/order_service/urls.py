# order_service/urls.py
from django.urls import path
from .views import ConfirmOrderView

urlpatterns = [
    path('confirm_order/', ConfirmOrderView.as_view(), name='confirm_order'),
]