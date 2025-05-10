# cart_service/models.py
from django.db import models
from django.conf import settings # สำหรับ User Model
from sheet_service.models import Sheet # เพื่ออ้างอิงถึง Sheet Model

class Cart(models.Model):
    """
    Model สำหรับตะกร้าสินค้าของผู้ใช้แต่ละคน
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

    @property
    def total_items(self):
        return self.items.count()

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    """
    Model สำหรับแต่ละรายการสินค้าในตะกร้า
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_addition = models.DecimalField(max_digits=10, decimal_places=2) # เพื่อเก็บราคา ณ เวลาที่เพิ่ม

    class Meta:
        unique_together = ('cart', 'sheet') # ตรวจสอบให้แน่ใจว่ามีรายการชีทเดียวต่อตะกร้า

    def __str__(self):
        return f"{self.quantity} x {self.sheet.name} in {self.cart.user.username}'s cart"

    @property
    def subtotal(self):
        return self.quantity * self.price_at_addition