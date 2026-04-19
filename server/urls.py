"""
URL configuration for white-hat-coffee backend
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import SignUpViewSet, LoginViewSet

# Create a router for API endpoints
router = routers.DefaultRouter()
router.register(r'auth/signup', SignUpViewSet, basename='signup')
router.register(r'auth/login', LoginViewSet, basename='login')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
