FROM python:3.9.2-slim

COPY . /web
WORKDIR /web

RUN python3 -m venv /opt/venv

RUN /opt/venv/bin/pip install pip --upgrade && \
    /opt/venv/bin/pip install -r ./web/requirements.txt && \
    chmod +x ./web/entrypoint.sh

CMD ["/web/entrypoint.sh"]