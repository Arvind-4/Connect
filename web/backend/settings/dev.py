import os
from .base import *

print('Dev Settings loaded')

SECRET_KEY = str(os.environ.get('SECRET_KEY'))

DEBUG = True

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

STATIC_URL = 'static/'

STATICFILES_DIRS = [
    BASE_DIR / 'static-dev',
]

STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ASGI_APPLICATION = 'backend.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    } 
}

LOGIN_URL = 'sign-in'

AUTH_USER_MODEL = 'accounts.Account'

INTERNAL_IPS = (
    '127.0.0.1',
    '192.168.1.23',
    'localhost',
)