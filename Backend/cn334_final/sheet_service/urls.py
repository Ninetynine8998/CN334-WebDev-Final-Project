# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('create_sheet/', views.CreateSheetView.as_view(), name='create_sheet'),
    path('select_sheet/', views.SelectSheetView.as_view(), name='select_sheet'),
]
