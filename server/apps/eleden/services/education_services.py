from apps.eleden.models import EduProgram, Discipline, EduHours


def get_related_edu_hours(edu_program: EduProgram, edu_hours: EduHours) -> EduHours:
    """Получение часов по плану из образовательной программы edu_program,
    которые соответствуют часам по плану edu_hours.
    :param edu_program: образовательная программа
    :param edu_hours: часы по плану
    """

    return EduHours.objects.get(
        course_number=edu_hours.course_number,
        semester_number=edu_hours.semester_number,
        value=edu_hours.value,
        work_kind_id=edu_hours.work_kind_id,
        hours_kind_id=edu_hours.hours_kind_id,
        discipline=Discipline.objects.get(
            edu_program=edu_program,
            code=edu_hours.discipline.code,
            name=edu_hours.discipline.name,
            units=edu_hours.discipline.units,
            hours=edu_hours.discipline.hours,
            kind_id=edu_hours.discipline.kind_id,
            view_id=edu_hours.discipline.view_id
        )
    )
