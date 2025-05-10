# sheet_service/models.py
from django.db import models
from subject_service.models import Subject


class Subject(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

# sheet_service/models.py

class Sheet(models.Model):
    # ตรวจสอบว่า Subject ถูก import มาจากที่ถูกต้อง (subject_service.models)
    # หากคุณมี Subject Model ในไฟล์นี้ และต้องการใช้ตัวนี้ ก็ไม่ต้อง import จากที่อื่น
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    content = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name




