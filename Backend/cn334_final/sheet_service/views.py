# sheet_service/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Sheet
from subject_service.models import Subject # ตรวจสอบว่า import จากที่ถูกต้อง
from .serializers import SheetSerializer


class CreateSheetView(APIView):
    def post(self, request):
        subject_id = request.data.get('subject_id')
        name = request.data.get('name')
        content = request.data.get('content')
        price = request.data.get('price')

        if not all([subject_id, name, content, price]):
            return Response({'error': 'subject_id, name, content, and price are required'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

        sheet = Sheet.objects.create(subject=subject, name=name, content=content, price=price)
        serializer = SheetSerializer(sheet)
        return Response({'sheet': serializer.data}, status=status.HTTP_201_CREATED)


class SelectSheetView(APIView):
    def get(self, request):
        subject_id = request.query_params.get('subject_id')
        if not subject_id:
            return Response({'error': 'subject_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        sheets = Sheet.objects.filter(subject_id=subject_id)
        serializer = SheetSerializer(sheets, many=True)
        return Response({'sheets': serializer.data}, status=status.HTTP_200_OK)

class SheetDetailView(APIView):
    def post(self, request):
        sheet_id = request.data.get('sheet_id')
        if not sheet_id:
            return Response({'error': 'sheet_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            sheet = Sheet.objects.get(id=sheet_id)
        except Sheet.DoesNotExist:
            return Response({'error': 'Sheet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SheetSerializer(sheet)
        return Response({'sheet': serializer.data}, status=status.HTTP_200_OK)
