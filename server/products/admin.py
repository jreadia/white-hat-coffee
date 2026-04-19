"""Admin configuration for products"""
from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin interface for Product"""
    list_display = ('name', 'price', 'available', 'created_at')
    search_fields = ('name',)
    list_filter = ('available', 'created_at')
