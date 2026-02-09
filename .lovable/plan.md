

# Перестройка виджета навыков: два слоя на радаре и реальный прогресс

## Что меняется

### 1. Демо-данные: прогресс = 0%
Сейчас `demoSkills.ts` содержит фейковые значения прогресса (23%, 50%, 88%...). Поскольку ни одно задание не выполнено, все `progress_percent` должны быть **0%**. Аналогично убираем фейковые `demoProgressBySlug` и `demoCompletedBySlug` из Index.tsx и MyProgress.tsx.

### 2. Два слоя на радар-чарте
Сейчас на радаре только один слой (фиолетовый прогресс). Нужно два:

- **Оранжевый пунктирный** -- целевой уровень (target_level): Basic=33%, Pro=66%, AI-Native=100%. Показывает "потолок", до которого можно дорасти.
- **Фиолетовый сплошной** -- реальный прогресс (progress_percent). У незарегистрированного пользователя и на старте = 0%.

### 3. Логика по состояниям

| Состояние | Оранжевый слой (target) | Фиолетовый слой (progress) |
|-----------|------------------------|---------------------------|
| Гость (незарегистрирован) | Демо target_level из demoSkills (все Basic=33%) | 0% |
| Залогинен, ничего не менял | Все Basic (33%) | Реальный progress_percent из БД |
| Залогинен, выставил вручную | Выбранный target_level | Реальный progress_percent из БД |

## Технические изменения

### Файл: `src/data/demoSkills.ts`
- Все `progress_percent` --> **0**
- Все `current_level` --> **1** (Basic)
- `target_level` оставить **1** (Basic) для всех -- это дефолт

### Файл: `src/hooks/useUserSkills.ts`
- В `mapDemoToUserSkills` -- `progress_percent: 0` (уже будет из demoSkills)
- При инициализации в БД (`initialize_user_skills`) -- target_level по умолчанию = 1 (Basic), это уже так

### Файл: `src/pages/Index.tsx`
- Убрать `demoProgressBySlug` и `demoCompletedBySlug` -- больше не нужны фейковые данные
- Убрать функцию `getDisplayProgress` -- использовать `skill.progress_percent` напрямую
- В `radarData` добавить поле `target` -- значение целевого уровня в процентах (target_level: 1->33, 2->66, 3->100)
- Добавить второй компонент `<Radar>` внутри `<RadarChart>`:
  ```tsx
  // Оранжевый пунктирный -- целевой уровень
  <Radar
    name="Цель"
    dataKey="target"
    stroke="#F97316"
    fill="#F97316"
    fillOpacity={0.08}
    strokeWidth={2}
    strokeDasharray="6 4"
  />
  // Фиолетовый сплошной -- реальный прогресс
  <Radar
    name="Прогресс"
    dataKey="value"
    stroke="#8B5CF6"
    fill="#8B5CF6"
    fillOpacity={0.25}
    strokeWidth={3}
  />
  ```
- Обновить тултипы в dropdown: показывать реальные 0/N вместо фейковых

### Файл: `src/pages/MyProgress.tsx`
- Аналогичные изменения: убрать `demoProgressBySlug`, `demoCompletedBySlug`, `getDisplayProgress`
- Добавить второй слой `<Radar>` (оранжевый пунктирный) для target_level
- В списке навыков: показывать реальный `skill.progress_percent` (0% на старте)
- В бейдже уровня: показывать `current_level` как есть

### Хелпер для конвертации уровня в проценты
Добавить в оба файла (или вынести в утилиту):
```tsx
const levelToPercent = (level: number): number => {
  if (level === 1) return 33;
  if (level === 2) return 66;
  return 100;
};
```

## Итого: 4 файла
1. `src/data/demoSkills.ts` -- обнулить progress_percent и current_level
2. `src/hooks/useUserSkills.ts` -- минимальные правки (данные уже корректны из demoSkills)
3. `src/pages/Index.tsx` -- два слоя радара, убрать фейковые данные
4. `src/pages/MyProgress.tsx` -- два слоя радара, убрать фейковые данные, реальный прогресс в списке

