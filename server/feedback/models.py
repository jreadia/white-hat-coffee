"""Feedback models"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Feedback(models.Model):
    """Feedback model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback')
    message = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedback'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback from {self.user.email} - {self.created_at}"
