"""Admin configuration for users"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """Admin interface for CustomUser"""
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number',)}),
    )
    list_display = ('email', 'first_name', 'last_name', 'phone_number', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
