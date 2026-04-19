"""Views for Order management"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from products.models import Product


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for order management"""
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        """Get orders for current user (or all for admin)"""
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)
    
    def list(self, request, *args, **kwargs):
        """Get user's orders"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'orders': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        """Get a single order by ID"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'order': serializer.data
        })
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def create_from_cart(self, request):
        """Create order from cart items"""
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            order = serializer.save()
            response_serializer = OrderSerializer(order)
            return Response({
                'success': True,
                'order': response_serializer.data,
                'message': 'Order created successfully. We are preparing your order!'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Update order status (admin only)"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({
                'success': False,
                'error': f'Invalid status. Valid options: {[s[0] for s in Order.STATUS_CHOICES]}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'order': serializer.data,
            'message': f'Order status updated to {new_status}'
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def cancel_order(self, request, pk=None):
        """Cancel an order (admin only)"""
        order = self.get_object()
        
        if order.status == 'completed':
            return Response({
                'success': False,
                'error': 'Cannot cancel a completed order'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = 'cancelled'
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'order': serializer.data,
            'message': 'Order cancelled successfully'
        })
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAdminUser])
    def delete_order(self, request, pk=None):
        """Delete an order (admin only)"""
        order = self.get_object()
        order_id = order.id
        order.delete()
        
        return Response({
            'success': True,
            'message': f'Order #{order_id} deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
