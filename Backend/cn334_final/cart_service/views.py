from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
# cart_service/views.py

def get_order(request):
    return JsonResponse({"message": "Cart order list"})
