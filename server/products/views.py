"""Views for Product management"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for product management"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'list' or self.action == 'retrieve':
            # Allow anyone to view products
            permission_classes = [AllowAny]
        elif self.action == 'admin_list':
            # Only admins can see all products (including unavailable)
            permission_classes = [IsAdminUser]
        else:
            # Only admins can create, update, delete
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def admin_list(self, request):
        """Get all products including unavailable ones (admin only)"""
        queryset = self.get_queryset().all()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response({
            'success': True,
            'products': serializer.data
        })
    
    def list(self, request, *args, **kwargs):
        """Get all available products (customers only see available=True)"""
        queryset = self.get_queryset().filter(available=True)
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response({
            'success': True,
            'products': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        """Get a single product by ID"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response({
            'success': True,
            'product': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Create a new product (admin only)"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'product': serializer.data,
                'message': 'Product created successfully.'
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Update a product (admin only)"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'product': serializer.data,
                'message': 'Product updated successfully.'
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Delete a product (admin only)"""
        instance = self.get_object()
        product_name = instance.name
        instance.delete()
        return Response({
            'success': True,
            'message': f'Product "{product_name}" deleted successfully.'
        }, status=status.HTTP_204_NO_CONTENT)
