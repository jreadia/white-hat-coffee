"""Serializers for User Authentication"""
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import update_last_login

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'is_superuser', 'is_staff', 
                  'building_number', 'street_name', 'street_address', 'state', 'city')
        read_only_fields = ('id', 'is_superuser', 'is_staff')


class SignUpSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='Confirm Password'
    )
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'password', 'password_confirm')
    
    def validate(self, data):
        """Validate that passwords match"""
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data
    
    def validate_email(self, value):
        """Validate that email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
    
    def create(self, validated_data):
        """Create a new user"""
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        write_only=True
    )
    
    def validate(self, data):
        """Authenticate user with email and password"""
        email = data.get('email')
        password = data.get('password')
        
        # Get user by email first
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")
        
        # Authenticate using username (Django default)
        user = authenticate(username=user.username, password=password)
        
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        
        data['user'] = user
        return data


class CustomerProfileSerializer(serializers.ModelSerializer):
    """Serializer for customer profile with address fields"""
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 
                  'building_number', 'street_name', 'street_address', 'state', 'city')
        read_only_fields = ('id', 'email')
