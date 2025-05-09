# cart_service/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # ตัวอย่างเส้นทาง
    path('get_order/', views.get_order, name='get_order'),
]
