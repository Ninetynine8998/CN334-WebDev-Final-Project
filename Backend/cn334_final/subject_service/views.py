from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Subject
from .serializers import SubjectSerializer

@api_view(['GET'])
def all_subject(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response({"subjects": serializer.data})

@api_view(['POST'])
def create_subject(request):
    serializer = SubjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
