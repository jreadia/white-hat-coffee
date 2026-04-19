"""Feedback API Views"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count
from .models import Feedback
from .serializers import FeedbackSerializer, FeedbackDetailSerializer
from sentiment.processor import analyze_sentiment, get_model_status


class FeedbackViewSet(viewsets.ModelViewSet):
    """API endpoints for feedback and sentiment analysis"""
    permission_classes = [IsAuthenticated]
    serializer_class = FeedbackSerializer
    
    def get_queryset(self):
        """
        Return user's own feedback or all feedback if admin.
        """
        user = self.request.user
        if user.is_superuser:
            return Feedback.objects.all()
        return Feedback.objects.filter(user=user)
    
    def perform_create(self, serializer):
        """Analyze sentiment when creating feedback"""
        feedback_text = serializer.validated_data.get('message', '')
        
        # Analyze sentiment
        sentiment_result = analyze_sentiment(feedback_text)
        
        # Save feedback with sentiment data
        feedback = serializer.save(user=self.request.user)
        feedback.sentiment = sentiment_result.get('sentiment')
        feedback.sentiment_confidence = sentiment_result.get('confidence')
        feedback.sentiment_label = sentiment_result.get('label')
        feedback.save()
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """
        Get sentiment analytics for admin.
        Returns aggregated sentiment statistics.
        Only accessible to admin users.
        """
        if not request.user.is_superuser:
            return Response(
                {'detail': 'Only admins can view analytics.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        all_feedback = Feedback.objects.all()
        
        # Count sentiments
        positive = all_feedback.filter(sentiment='positive').count()
        negative = all_feedback.filter(sentiment='negative').count()
        neutral = all_feedback.filter(sentiment='neutral').count()
        
        total = all_feedback.count()
        
        # Calculate percentages
        percentages = {
            'positive': (positive / total * 100) if total > 0 else 0,
            'negative': (negative / total * 100) if total > 0 else 0,
            'neutral': (neutral / total * 100) if total > 0 else 0,
        }
        
        # Calculate average rating
        avg_rating = all_feedback.aggregate(avg=Avg('rating'))['avg']
        
        return Response({
            'total_feedback': total,
            'counts': {
                'positive': positive,
                'negative': negative,
                'neutral': neutral,
            },
            'percentages': percentages,
            'average_rating': float(avg_rating) if avg_rating is not None else 0.0
        })
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent feedback with sentiment analysis"""
        if not request.user.is_superuser:
            return Response(
                {'detail': 'Only admins can view feedback.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        recent_feedback = Feedback.objects.all()[:20]
        serializer = FeedbackDetailSerializer(recent_feedback, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def check_model(self, request):
        """Check if sentiment model is loaded and ready"""
        if not request.user.is_superuser:
            return Response(
                {'detail': 'Only admins can check model status.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        status_info = get_model_status()
        return Response(status_info)
