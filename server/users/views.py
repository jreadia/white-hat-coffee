"""Views for User Authentication"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import SignUpSerializer, LoginSerializer, UserSerializer, CustomerProfileSerializer

User = get_user_model()


class SignUpViewSet(viewsets.ViewSet):
    """ViewSet for user registration"""
    permission_classes = (AllowAny,)
    
    def create(self, request):
        """Handle user registration"""
        serializer = SignUpSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            user_data = UserSerializer(user).data
            
            return Response({
                'success': True,
                'user': user_data,
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'User registered successfully.'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginViewSet(viewsets.ViewSet):
    """ViewSet for user login"""
    permission_classes = (AllowAny,)
    
    def create(self, request):
        """Handle user login"""
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            user_data = UserSerializer(user).data
            
            return Response({
                'success': True,
                'user': user_data,
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Login successful.'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_401_UNAUTHORIZED)


class CustomerProfileViewSet(viewsets.ViewSet):
    """ViewSet for customer profile management"""
    permission_classes = (IsAuthenticated,)
    
    def list(self, request):
        """Get current user's profile"""
        serializer = CustomerProfileSerializer(request.user)
        return Response({
            'success': True,
            'profile': serializer.data
        }, status=status.HTTP_200_OK)
    
    def create(self, request):
        """Update current user's profile"""
        user = request.user
        serializer = CustomerProfileSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'profile': serializer.data,
                'message': 'Profile updated successfully.'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)