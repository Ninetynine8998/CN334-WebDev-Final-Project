# sheet_service/models.py
from django.db import models
from subject_service.models import Subject


class Subject(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Sheet(models.Model):
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return self.name



