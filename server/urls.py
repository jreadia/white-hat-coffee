"""
URL configuration for white-hat-coffee backend
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import SignUpViewSet, LoginViewSet, CustomerProfileViewSet
from products.views import ProductViewSet
from orders.views import OrderViewSet

# Create a router for API endpoints
router = routers.DefaultRouter()
router.register(r'auth/signup', SignUpViewSet, basename='signup')
router.register(r'auth/login', LoginViewSet, basename='login')
router.register(r'customer/profile', CustomerProfileViewSet, basename='profile')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
