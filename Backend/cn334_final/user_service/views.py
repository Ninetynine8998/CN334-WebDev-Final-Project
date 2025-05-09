from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def dashboard_view(request):
    return JsonResponse({"message": "User dashboard loaded."})
