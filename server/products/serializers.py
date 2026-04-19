"""Serializers for Product model"""
from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        """Return the full image URL"""
        if obj.image:
            # For Supabase Storage, construct the public URL
            if hasattr(obj.image, 'name') and obj.image.name:
                # Get project reference from settings
                from django.conf import settings
                from decouple import config
                
                supabase_url = config('SUPABASE_URL', default='https://wiqjludbbjxcaturbllb.supabase.co')
                bucket_name = config('AWS_STORAGE_BUCKET_NAME', default='white-hat-coffee')
                
                # Construct Supabase public URL
                image_path = obj.image.name
                return f"{supabase_url}/storage/v1/object/public/{bucket_name}/{image_path}"
            
            # Fallback to default URL
            url = obj.image.url
            if url.startswith('http'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'description', 'image', 'image_url', 'available', 'created_at')
        read_only_fields = ('id', 'created_at', 'image_url')
