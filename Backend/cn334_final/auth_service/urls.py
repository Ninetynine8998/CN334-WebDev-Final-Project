from django.urls import path
from .views import RegisterView, LoginView

from django.urls import path
from .views import *  # นำเข้า register ของคุณตามเดิม
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]

