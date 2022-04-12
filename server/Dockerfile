FROM python:3.9.10-slim

MAINTAINER Luferov Victor <lyferov@yandex.ru>

ENV PYTHONUNBUFFERED 1
ENV PATH /usr/local/bin:$PATH
ENV LANG C.UTF-8
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN apt-get update -y && \
    pip install daphne poetry && \
    pip install --upgrade pip && \
    apt-get install build-essential -y && \
    apt-get install libreoffice -y  && \
    apt-get install libreoffice --upgrade

# Копируем приложение
COPY . /usr/src/app

RUN poetry install
# Точка входа в контейнер
CMD ['python']
