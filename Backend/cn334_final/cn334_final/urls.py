"""
URL configuration for cn334_final project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# Import Views ของ simplejwt
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # สำหรับ Login
    TokenRefreshView,    # สำหรับ Refresh Token
    TokenVerifyView,     # สำหรับ Verify Token
)


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/auth/', include('auth_service.urls')),
    path('api/sheet/', include('sheet_service.urls')),
    path('api/cart/', include('cart_service.urls')),
    path('api/user/', include('user_service.urls')),
    path('api/subject/', include('subject_service.urls')),
    path('api/order/', include('order_service.urls')), 
    path('api/dashboard/', include('dashboard_service.urls')), # เพิ่มบรรทัดนี้
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

]
