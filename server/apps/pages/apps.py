"""Setting for page app."""

from django.apps import AppConfig


class PagesConfig(AppConfig):
    """Setting page config."""

    name = 'apps.pages'

    def ready(self):
        """Import settings when app is loaded."""
        import apps.pages.signals # noqa
