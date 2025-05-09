from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Sheet, Subject  # ต้อง import Subject ด้วย
from .serializers import SheetSerializer

class CreateSheetView(APIView):
    def post(self, request):
        subject_id = request.data.get('subject_id')
        name = request.data.get('name')
        content = request.data.get('content')

        if not subject_id or not name or not content:
            return Response({'error': 'subject_id, name, and content are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

        new_sheet = Sheet.objects.create(subject=subject, name=name, content=content)
        serializer = SheetSerializer(new_sheet)
        return Response({'sheet': serializer.data}, status=status.HTTP_201_CREATED)


class SelectSheetView(APIView):
    def get(self, request):
        subject_id = request.query_params.get('subject_id')
        if not subject_id:
            return Response({'error': 'subject_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sheets = Sheet.objects.filter(subject__id=subject_id)
            serializer = SheetSerializer(sheets, many=True)
            return Response({'sheets': serializer.data}, status=status.HTTP_200_OK)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
