"""App configuration for orders"""
from django.apps import AppConfig


class OrdersConfig(AppConfig):
    """Configuration for the orders app"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'orders'
