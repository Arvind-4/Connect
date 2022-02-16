"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""


# BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
# ENV_FILE_PATH = BASE_DIR / '.env'

import os
import pathlib
import dotenv
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path

import apps.video.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "https": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.video.routing.websocket_urlpatterns
        )
    ),
})