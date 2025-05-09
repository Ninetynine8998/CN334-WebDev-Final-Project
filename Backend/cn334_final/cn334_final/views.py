from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import *
from .serializers import RegisterSerializer

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        if data['password'] != data['confirm_password']:
            return Response({'status': 'error', 'message': 'Passwords do not match'}, status=400)
        user = User.objects.create_user(username=data['username'], email=data['email'], password=data['password'])
        token = Token.objects.create(user=user)
        return Response({'status': 'success', 'message': 'Registered', 'token': token.key})

class LoginView(APIView):
    def post(self, request):
        data = request.data
        user = authenticate(username=data.get('username') or data.get('email'), password=data['password'])
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'status': 'success', 'message': 'Logged in', 'token': token.key})
        return Response({'status': 'error', 'message': 'Invalid credentials'}, status=400)

class AllSubjectView(APIView):
    def get(self, request):
        subjects = Subject.objects.all().values()
        return Response({'subjects': list(subjects)})

class SelectSheetView(APIView):
    def get(self, request):
        subject_id = request.query_params.get('subject_id')
        sheets = Sheet.objects.filter(subject_id=subject_id).values()
        return Response({'sheet': list(sheets)})

class SheetDetailView(APIView):
    def post(self, request):
        sheet_id = request.data['sheet_id']
        sheet = Sheet.objects.filter(id=sheet_id).values().first()
        return Response({'sheet': sheet})

class AddToCartView(APIView):
    def post(self, request):
        sheet_id = request.data['sheet_id']
        user = request.user
        cart, _ = Cart.objects.get_or_create(user=user)
        cart.sheets.add(sheet_id)
        return Response({'status': 'success'})

class GetOrderView(APIView):
    def post(self, request):
        cart = Cart.objects.get(user=request.user)
        sheets = cart.sheets.all().values()
        return Response({'sheet': list(sheets)})

class DeleteItemView(APIView):
    def delete(self, request):
        sheet_id = request.data['sheet_id']
        cart = Cart.objects.get(user=request.user)
        cart.sheets.remove(sheet_id)
        return Response({'status': 'success', 'message': 'Item removed'})

class ConfirmOrderView(APIView):
    def post(self, request):
        data = request.data
        cart = Cart.objects.get(user=request.user)
        Order.objects.create(user=request.user, cart=cart, email=data['email'], tel=data['tel'])
        return Response({'status': 'success', 'message': 'Order confirmed'})

class DashboardView(APIView):
    def post(self, request):
        user_id = request.data['user_id']
        orders = Order.objects.filter(user_id=user_id).values('cart__sheets__id')
        return Response({'sheet_id': list(orders)})
