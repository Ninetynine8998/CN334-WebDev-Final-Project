from django.urls import path
from .views import all_subject, create_subject

urlpatterns = [
    path('all_subject/', all_subject, name='all_subject'),
    path('create_subject/', create_subject, name='create_subject'),
]
