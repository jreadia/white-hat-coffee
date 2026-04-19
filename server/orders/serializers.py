"""Serializers for Order models"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Order, OrderItem
from products.models import Product
from products.serializers import ProductSerializer

User = get_user_model()


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_id', 'quantity', 'price')
        read_only_fields = ('id', 'product')


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'user_email', 'total_price', 'payment_method', 'status', 'items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user_email', 'created_at', 'updated_at')


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating orders from cart items"""
    items = OrderItemSerializer(many=True, write_only=True)
    payment_method = serializers.CharField(max_length=50)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    def create(self, validated_data):
        """Create order with items from cart"""
        user = self.context['request'].user
        items_data = validated_data.pop('items')
        payment_method = validated_data['payment_method']
        total_price = validated_data['total_price']
        
        # Create order
        order = Order.objects.create(
            user=user,
            total_price=total_price,
            payment_method=payment_method
        )
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                quantity=item_data['quantity'],
                price=item_data['price']
            )
        
        return order
