"""Admin configuration for orders"""
from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """Inline admin for OrderItem"""
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin interface for Order"""
    list_display = ('id', 'user', 'total_price', 'status', 'created_at')
    search_fields = ('user__email', 'id')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]
