from datetime import datetime

from django import template
from apps.core.models import User
register = template.Library()


@register.simple_tag()
def get_short_name(user_id: int):
    user: User = User.objects.get(pk=user_id)
    name = f'{user.last_name[0]}{user.first_name[0]}'
    return name


@register.simple_tag()
def get_experience(date: str):
    experience = 'Стаж не указан'
    if date:
        today = datetime.now()
        experience = datetime.date(today) - datetime.date(datetime.strptime(date, "%Y-%m-%d"))
        years = experience.days // 365
        if years % 10 == 1:
            experience = f'{years} год'
        elif years % 10 in [2, 3, 4]:
            experience = f'{years} годa'
        elif years == 0:
            experience = 'Стаж менее года'
        else:
            experience = f'{years} лет'
    return experience
