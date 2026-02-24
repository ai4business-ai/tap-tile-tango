

# Desktop-версия приложения: продуманный UX

## Общая концепция

Приложение сейчас жестко ограничено шириной `max-w-md` (448px) и использует мобильные паттерны (нижняя навигация, одноколоночный стек). Для десктопа нужна полноценная перекомпоновка, а не просто растягивание.

### Ключевые решения

```text
+--------------------------------------------------+
|  TopHeader (расширенный, с навигацией)            |
+----------+---------------------------------------+
|          |                                       |
| Sidebar  |        Контент (адаптивный)           |
| (desktop)|                                       |
|          |                                       |
+----------+---------------------------------------+
```

**Мобильная навигация** (BottomNavigation) скрывается на `lg+`, появляется **боковой sidebar**.

## Изменения по файлам

### 1. `src/components/Layout.tsx` -- адаптивная структура

- На `lg+`: показывать Sidebar слева + основной контент справа
- На `< lg`: сохранить текущую мобильную структуру
- Убрать жесткий `max-w-md` на десктопе, заменить на `max-w-5xl`
- Sidebar: вертикальное меню с теми же пунктами (Главная, Задания, Прогресс, Теория)

### 2. Новый компонент `src/components/DesktopSidebar.tsx`

- Вертикальная навигация: Главная, Задания, Прогресс, Теория
- Кнопка "Следующее задание" (акцентная)
- Блок пользователя внизу (аватар, имя, кнопка выхода)
- Логотип hakku.ai наверху
- Glass-стиль, фиксированная позиция, ширина ~240px
- Отображается только на `lg+` (`hidden lg:flex`)

### 3. `src/components/BottomNavigation.tsx`

- Добавить `hidden lg:hidden` -- скрывать на десктопе

### 4. `src/components/TopHeader.tsx`

- На десктопе: расширить на всю ширину (убрать `max-w-md`)
- На десктопе: скрыть, т.к. навигация в sidebar

### 5. `src/pages/Index.tsx` -- дашборд в 2 колонки

На десктопе (`lg+`):
```text
+----------------------------+-------------------+
| Radar Chart (большой)      | Overall Progress  |
|                            | Skills count      |
|                            | Assignments done  |
+----------------------------+-------------------+
| Next Task    |  My Tasks   | Webinar Records   |
+--------------+-------------+-------------------+
```

- Использовать CSS Grid `lg:grid-cols-2` для верхней секции
- Карточки нижней части в `lg:grid-cols-3`
- Радар-чарт становится крупнее (height: 400px на десктопе)

### 6. Страницы заданий (TaskClientResponse и аналогичные) -- 2 колонки

Главное UX-улучшение для десктопа:

```text
+-----------------------------+---------------------------+
| Описание задания            | Тестирование промпта      |
| Ваша задача                 | (песочница, чат с AI)      |
| Критерии оценки             |                           |
|                             +---------------------------+
|                             | Чат с тьютором            |
|                             | (сдача задания)           |
+-----------------------------+---------------------------+
```

- Левая колонка: условие задания (описание + задача + критерии) -- фиксированная/скроллируемая
- Правая колонка: PromptTester + TutorChat -- основная рабочая зона
- На мобильном: одна колонка как сейчас
- Реализация: `lg:grid lg:grid-cols-2 lg:gap-6`

Обновить все 6 страниц заданий:
- `TaskClientResponse.tsx`
- `TaskFeedback.tsx`
- `TaskMeetingAgenda.tsx`
- `TaskDeepResearch.tsx`
- `TaskDocumentAnalysis.tsx`
- `TaskSpecializedGPT.tsx`

### 7. `src/pages/Tasks.tsx` -- grid карточек

- На десктопе: `lg:grid-cols-2 xl:grid-cols-3` для списка навыков
- Карточки становятся более информативными (больше места)

### 8. `src/pages/MyProgress.tsx` -- 2 колонки

- Радар-чарт слева (крупный), список навыков справа
- `lg:grid lg:grid-cols-2 lg:gap-8`

### 9. `src/pages/SkillAssignments.tsx` -- горизонтальный layout уровней

- На десктопе: уровни Basic / Pro / AI-Native в 3 колонки рядом
- `lg:grid lg:grid-cols-3 lg:gap-4`

### 10. `src/pages/WebinarRecords.tsx`

- Карточки в `lg:grid-cols-2 xl:grid-cols-3`

### 11. `src/index.css`

- Адаптировать glass-header для desktop ширины
- Добавить стили для sidebar

### 12. `src/hooks/use-mobile.tsx`

- Добавить хук `useIsDesktop()` (breakpoint 1024px) для удобства

## Технические детали

- Breakpoint: `lg` (1024px) -- переключение mobile/desktop
- Sidebar: 240px фиксированная ширина
- Контент: `max-w-5xl` на десктопе вместо `max-w-md`
- Все изменения через Tailwind responsive классы (`lg:`)
- Мобильная версия остается без изменений

## Итого файлов: ~14

- `src/components/DesktopSidebar.tsx` (новый)
- `src/components/Layout.tsx`
- `src/components/BottomNavigation.tsx`
- `src/components/TopHeader.tsx`
- `src/hooks/use-mobile.tsx`
- `src/index.css`
- `src/pages/Index.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/MyProgress.tsx`
- `src/pages/SkillAssignments.tsx`
- `src/pages/WebinarRecords.tsx`
- `src/pages/TaskClientResponse.tsx` (+ 5 аналогичных task-страниц)

