# sheet_service/urls.py

from django.urls import path
from .views import CreateSheetView, SelectSheetView, SheetDetailView

urlpatterns = [
    path('create_sheet/', CreateSheetView.as_view()),
    path('select_sheet/', SelectSheetView.as_view()),
    path('sheet_detail/', SheetDetailView.as_view(), name='sheet_detail'),

]
