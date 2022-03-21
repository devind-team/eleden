from apps.sveden.models import Subsection


def create_subsection(header: str, url: str) -> Subsection:
    """Создание подраздела
    :param header: название подраздела
    :param url: адрес подраздела
    """
    return Subsection.objects.create(url=url, header=header)


def change_subsection(subsection: Subsection, header: str, url: str) -> None:
    """Изменение подраздела
    :param subsection: изменяемый подраздел
    :param header: название подраздела
    :param url: адрес подраздела
    """
    subsection.header = header
    subsection.url = url
    subsection.save()
