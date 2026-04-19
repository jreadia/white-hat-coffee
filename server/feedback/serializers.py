"""Feedback Serializers"""
from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    """Basic feedback serializer for creating and reading feedback"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Feedback
        fields = ['id', 'message', 'rating', 'user_email', 'created_at']
        read_only_fields = ['id', 'user_email', 'created_at']


class FeedbackDetailSerializer(serializers.ModelSerializer):
    """Detailed feedback serializer with sentiment analysis results"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Feedback
        fields = [
            'id',
            'message',
            'rating',
            'user_email',
            'created_at',
            'sentiment',
            'sentiment_confidence',
            'sentiment_label'
        ]
        read_only_fields = [
            'id',
            'user_email',
            'created_at',
            'sentiment',
            'sentiment_confidence',
            'sentiment_label'
        ]
