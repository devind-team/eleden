from django.apps import AppConfig

from devind_helpers.redis_client import redis


class MessengerConfig(AppConfig):
    name = 'apps.messenger'

    def ready(self):
        redis.delete('chatting')
