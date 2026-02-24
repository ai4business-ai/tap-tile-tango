

# LMS (Learning Management System) -- Полноценная платформа курсов

## Концепция

Текущий тренажер промптов становится одним из курсов внутри LMS. Добавляется каталог курсов, страница "Мои курсы", и гибкая архитектура для разных форматов обучения (теория + практика, видео-курсы, квизы/тесты).

```text
+------------------------------------------+
|              hakku.ai LMS                |
+----------+-------------------------------+
|          |  Каталог курсов               |
| Sidebar  |  Мои курсы                    |
|          |  [Тренажер AI] [SQL курс] ... |
|          |                               |
|          |  Внутри курса:                |
|          |  Модули -> Уроки -> Контент   |
+----------+-------------------------------+
```

## Фаза 1: База данных (миграция)

### Новые таблицы

**courses** -- каталог курсов
- `id` (uuid, PK)
- `title` (text) -- "AI Тренажер", "Основы SQL" и т.д.
- `slug` (text, unique) -- "ai-trainer", "sql-basics"
- `description` (text)
- `cover_image_url` (text, nullable) -- обложка курса
- `course_type` (enum: 'trainer', 'theory_practice', 'video', 'quiz') -- тип формата
- `is_published` (boolean, default false)
- `order_index` (integer)
- `created_at`, `updated_at`

**course_modules** -- модули/темы внутри курса
- `id` (uuid, PK)
- `course_id` (uuid, FK -> courses)
- `title` (text) -- "Группировка и агрегации"
- `description` (text, nullable)
- `order_index` (integer)
- `created_at`, `updated_at`

**course_lessons** -- уроки внутри модуля
- `id` (uuid, PK)
- `module_id` (uuid, FK -> course_modules)
- `title` (text) -- "Как группировать данные по категориям"
- `lesson_type` (enum: 'theory', 'practice', 'video', 'quiz', 'trainer_task')
- `content_json` (jsonb) -- гибкий контент: текст, код, видео-URL, вопросы квиза
- `order_index` (integer)
- `trainer_skill_id` (uuid, nullable, FK -> skills) -- связь с тренажером (для lesson_type = 'trainer_task')
- `trainer_assignment_id` (uuid, nullable, FK -> assignments) -- связь с заданием тренажера
- `created_at`, `updated_at`

**user_courses** -- записи пользователей на курсы
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL)
- `course_id` (uuid, FK -> courses)
- `enrolled_at` (timestamptz, default now())
- `last_lesson_id` (uuid, nullable, FK -> course_lessons) -- последний открытый урок
- `progress_percent` (integer, default 0)
- `environment` (environment_type, default 'dev')
- UNIQUE(user_id, course_id, environment)

**user_lesson_progress** -- прогресс по урокам
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL)
- `lesson_id` (uuid, FK -> course_lessons)
- `status` (enum: 'not_started', 'in_progress', 'completed')
- `score` (integer, nullable) -- для квизов/практики
- `completed_at` (timestamptz, nullable)
- `environment` (environment_type, default 'dev')
- UNIQUE(user_id, lesson_id, environment)

### Новый enum

```sql
CREATE TYPE lesson_type AS ENUM ('theory', 'practice', 'video', 'quiz', 'trainer_task');
CREATE TYPE course_type AS ENUM ('trainer', 'theory_practice', 'video', 'quiz');
CREATE TYPE lesson_status AS ENUM ('not_started', 'in_progress', 'completed');
```

### RLS политики

- **courses**: SELECT для всех (каталог публичный)
- **course_modules, course_lessons**: SELECT для всех (контент открыт)
- **user_courses**: CRUD только для своих записей (user_id = auth.uid())
- **user_lesson_progress**: CRUD только для своих записей

### Связь с тренажером

Текущие таблицы `skills` и `assignments` остаются. Создается одна запись в `courses` с `course_type = 'trainer'` и `slug = 'ai-trainer'`. Уроки типа `trainer_task` ссылаются на существующие `assignments` через `trainer_assignment_id`.

## Фаза 2: Навигация и роутинг

### Обновление навигации (DesktopSidebar + BottomNavigation)

Текущие пункты:
- Главная -> остается
- Задания -> переименовать в "Мои курсы" (`/my-courses`)
- Прогресс -> остается
- Теория -> убрать (теория внутри курсов)

Добавить:
- "Каталог" (`/catalog`) -- все доступные курсы

### Новые маршруты (App.tsx)

```text
/catalog                          -- Каталог всех курсов
/my-courses                       -- Мои курсы (записанные)
/course/:courseSlug                -- Страница курса (программа, модули)
/course/:courseSlug/lesson/:lessonId  -- Просмотр урока
```

Старые маршруты `/tasks`, `/skill-assignments/:skillName`, `/task/:taskId` продолжают работать (обратная совместимость), но основной вход через курсы.

## Фаза 3: Страницы (Frontend)

### 3.1 Каталог курсов (`/catalog`) -- CourseCatalog.tsx

Карточки курсов в grid `lg:grid-cols-3`:
- Обложка курса
- Название + описание
- Тип курса (бейдж)
- Прогресс (если записан)
- Кнопка "Записаться" / "Продолжить"

### 3.2 Мои курсы (`/my-courses`) -- MyCourses.tsx

Как на скриншотах (Яндекс.Практикум):
- Карточка текущего курса с последним уроком и кнопкой "Учиться"
- Виджет "Вы занимались X/7 дней" с целью
- Программа курса (модули как карточки с обложками)
- Прогресс-бар по каждому курсу

### 3.3 Страница курса (`/course/:slug`) -- CoursePage.tsx

- Заголовок + прогресс
- Список модулей (аккордеон)
- Уроки внутри модулей: номер, название, статус (галочка / текущий / не начат)
- Прогресс-бар по уроками (как на скриншоте -- полоски сверху)

### 3.4 Просмотр урока (`/course/:slug/lesson/:id`) -- LessonView.tsx

Главный рендерер контента, определяющий отображение по `lesson_type`:

**theory**: Текстовый контент из `content_json` (Markdown/HTML), блоки кода с подсветкой, кнопка "AI Краткий пересказ урока"

**practice**: Двухколоночный layout (как на скриншоте):
- Левая: теория/описание задачи
- Правая: редактор кода + результат выполнения

**video**: Встроенный видеоплеер + конспект

**quiz**: Вопросы с вариантами ответа, проверка, подсказки

**trainer_task**: Перенаправление на существующую страницу задания тренажера (`/task/:taskId`)

Нижняя панель навигации урока: Подсказка | Проверить | Стрелки навигации | "Следующий урок"

### 3.5 Обновление Index.tsx (главная)

- Секция "Мои курсы" вместо / рядом с текущими карточками
- Текущий тренажер показывается как один из курсов
- Последний открытый урок с кнопкой "Продолжить"

## Фаза 4: Хуки и данные

### Новые хуки

- `useCourses()` -- загрузка каталога курсов
- `useUserCourses(userId)` -- курсы пользователя с прогрессом
- `useCourseContent(courseSlug)` -- модули и уроки курса
- `useLessonProgress(userId, lessonId)` -- прогресс по уроку
- `useEnrollCourse()` -- запись на курс

### Миграция данных тренажера

Создать запись курса "AI Тренажер" в `courses` при миграции. Существующие навыки и задания продолжают работать через текущую логику, но интегрируются в структуру курса.

## Фаза 5: content_json структура

Гибкий формат для разных типов уроков:

```text
-- Теория:
{
  "blocks": [
    {"type": "text", "content": "Markdown текст..."},
    {"type": "code", "language": "sql", "content": "SELECT ..."},
    {"type": "image", "url": "..."},
    {"type": "callout", "variant": "info", "content": "..."}
  ]
}

-- Квиз:
{
  "questions": [
    {
      "text": "Вопрос?",
      "options": ["A", "B", "C", "D"],
      "correct": 1,
      "explanation": "Потому что..."
    }
  ]
}

-- Видео:
{
  "video_url": "https://...",
  "transcript": "..."
}
```

## Порядок реализации (по сообщениям)

1. **Миграция БД**: Создать все таблицы, enums, RLS, seed курса "AI Тренажер"
2. **Каталог + Мои курсы**: Страницы + хуки + навигация
3. **Страница курса**: Модули, уроки, прогресс-бар
4. **Рендерер уроков**: LessonView + компоненты по типам
5. **Интеграция тренажера**: Привязка существующих заданий как уроков курса

## Итого файлов: ~20+

**Новые**:
- Миграция SQL (1 файл)
- `src/pages/CourseCatalog.tsx`
- `src/pages/MyCourses.tsx`
- `src/pages/CoursePage.tsx`
- `src/pages/LessonView.tsx`
- `src/components/lesson/TheoryBlock.tsx`
- `src/components/lesson/PracticeBlock.tsx`
- `src/components/lesson/QuizBlock.tsx`
- `src/components/lesson/VideoBlock.tsx`
- `src/components/lesson/LessonNavBar.tsx`
- `src/hooks/useCourses.ts`
- `src/hooks/useUserCourses.ts`
- `src/hooks/useCourseContent.ts`
- `src/hooks/useLessonProgress.ts`

**Модифицируемые**:
- `src/App.tsx` (роуты)
- `src/components/DesktopSidebar.tsx` (навигация)
- `src/components/BottomNavigation.tsx` (навигация)
- `src/pages/Index.tsx` (секция курсов)

