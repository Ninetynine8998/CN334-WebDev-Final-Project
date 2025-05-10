from django.urls import path
from .views import RegisterView, UserProfileView, AnotherProtectedView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('protected-example/', AnotherProtectedView.as_view(), name='auth_protected_example'),
    # ... URL อื่นๆ ที่เกี่ยวข้องกับ user_service
]