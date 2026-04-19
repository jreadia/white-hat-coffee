"""Serializers for Product model"""
from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        """Return the full image URL"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'description', 'image', 'image_url', 'available', 'created_at')
        read_only_fields = ('id', 'created_at', 'image_url')
