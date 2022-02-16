#!/bin/bash

/opt/venv/bin/python manage.py collectstatic --noinput

/opt/venv/bin/python manage.py makemigrations
/opt/venv/bin/python manage.py migrate --noinput

APP_PORT=${PORT:-8000}
/opt/venv/bin/daphne backend.asgi:application --bind "0.0.0.0" --port ${APP_PORT}