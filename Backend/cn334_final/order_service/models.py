# order_service/models.py
from django.db import models
from django.conf import settings
from sheet_service.models import Sheet # นำ Sheet Model มาใช้

class Order(models.Model):
    """
    Model สำหรับคำสั่งซื้อ
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),         # รอการชำระเงิน/ดำเนินการ
        ('processing', 'Processing'),   # กำลังดำเนินการ
        ('shipped', 'Shipped'),         # จัดส่งแล้ว
        ('delivered', 'Delivered'),     # จัดส่งสำเร็จ
        ('cancelled', 'Cancelled'),     # ยกเลิก
        ('refunded', 'Refunded'),       # คืนเงินแล้ว
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_date = models.DateTimeField(auto_now_add=True)
    
    # ข้อมูลการติดต่อสำหรับ Order นี้
    contact_email = models.EmailField(blank=True, null=True)
    contact_tel = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

    class Meta:
        ordering = ['-order_date'] # เรียงตามวันที่สั่งซื้อล่าสุด

class OrderItem(models.Model):
    """
    Model สำหรับแต่ละรายการสินค้าในคำสั่งซื้อ
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    sheet = models.ForeignKey(Sheet, on_delete=models.PROTECT) # ใช้ PROTECT เพื่อป้องกันการลบชีทที่มีอยู่ใน Order แล้ว
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2) # ราคา ณ เวลาที่ซื้อ

    def __str__(self):
        return f"{self.quantity} x {self.sheet.name} in Order {self.order.id}"

    @property
    def subtotal(self):
        return self.quantity * self.price_at_purchase