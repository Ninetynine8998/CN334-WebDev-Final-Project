# sheet_service/serializers.py

from rest_framework import serializers
from .models import Sheet

class SheetSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Sheet
        fields = ['id', 'name', 'subject', 'subject_name', 'content', 'price']




