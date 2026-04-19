"""Admin configuration for feedback"""
from django.contrib import admin
from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    """Admin interface for Feedback"""
    list_display = ('user', 'rating', 'created_at')
    search_fields = ('user__email', 'message')
    list_filter = ('rating', 'created_at')
    readonly_fields = ('created_at',)
