
# Исправление статуса уровней: "Запланировано" vs "Заблокировано"

## Проблема

Сейчас функция `getLevelStatus()` на страницах `SkillAssignments.tsx` и `SkillAssignmentsDemo.tsx` определяет статус уровня только по прогрессу выполнения заданий. Она никогда не проверяет `target_level` пользователя из таблицы `user_skills`. В результате все уровни без выполненных заданий показывают "Заблокировано".

## Логика

Маппинг уровней: Basic = 1, Pro = 2, AI-Native = 3.

Новая логика определения статуса уровня:

```text
1. Все задания уровня выполнены        --> "Выполнено" (зеленый)
2. Есть начатые/сданные задания        --> "В процессе" (желтый)
3. target_level >= номер уровня        --> "Запланировано" (желтый/синий)
4. target_level < номер уровня         --> "Заблокировано" (серый)
```

Уровень Basic (1) всегда доступен -- он никогда не может быть "Заблокировано".

## Технические изменения

### 1. `src/pages/SkillAssignments.tsx`

- Импортировать и использовать `useUserSkills` для получения `target_level` текущего навыка
- Добавить маппинг `levelToNumber`: `{ 'Basic': 1, 'Pro': 2, 'AI-Native': 3 }`
- Обновить `getLevelStatus()`:
  - Найти `target_level` для текущего `skillName` из данных `useUserSkills`
  - Если `target_level >= levelNumber` и нет прогресса -- вернуть `'planned'`
  - Если `target_level < levelNumber` -- вернуть `'locked'`
- Убрать блокировку контента (opacity-50, cursor-not-allowed) для уровней со статусом `'planned'` -- они должны быть доступны для клика

### 2. `src/pages/SkillAssignmentsDemo.tsx`

- Аналогичные изменения: подключить `useUserSkills`, обновить `getLevelStatus()`
- Для уровней `'planned'` убрать Lock-иконку и opacity-50, сделать контент кликабельным
- Добавить плашку "Запланировано" вместо Lock-иконки

### Итого: 2 файла
- `src/pages/SkillAssignments.tsx`
- `src/pages/SkillAssignmentsDemo.tsx`
