"""Feedback models"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Feedback(models.Model):
    """Feedback model with sentiment analysis"""
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
        ('unknown', 'Unknown'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback')
    message = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    sentiment = models.CharField(
        max_length=20,
        choices=SENTIMENT_CHOICES,
        null=True,
        blank=True,
        default='unknown'
    )
    sentiment_confidence = models.FloatField(null=True, blank=True, default=0.0)
    sentiment_label = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedback'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback from {self.user.email} - {self.created_at} ({self.sentiment})"
