-- Step 1: Add is_locked column to skills table
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT true;

-- Step 2: Unlock communication and research skills
UPDATE skills SET is_locked = false WHERE slug IN ('communication', 'research');

-- Step 3: Delete existing assignments
DELETE FROM assignments;

-- Step 4: Insert all assignments from demoAssignments
-- We'll use a WITH clause to map demo skill_ids to actual skill UUIDs

WITH skill_mapping AS (
  SELECT id, slug FROM skills
)
INSERT INTO assignments (skill_id, title, level, order_index, task_id)
VALUES
  -- Communication (demo-skill-1)
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Составление эффективного письма', 'Basic', 1, 'client-response'),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Подготовка повестки встречи', 'Basic', 2, 'meeting-agenda'),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Формулирование обратной связи', 'Basic', 3, 'feedback-colleagues'),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Создание презентации идеи', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Адаптация сообщения под аудиторию', 'Pro', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Разрешение конфликта в команде', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Модерация групповой дискуссии', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Кросс-культурная коммуникация', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Создание коммуникационной стратегии', 'AI-Native', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Анализ тональности коммуникаций', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'communication'), 'Автоматизация внутренних коммуникаций', 'AI-Native', 11, null),
  
  -- Knowledge Management (demo-skill-2)
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Систематизация документов', 'Basic', 1, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Создание базы знаний', 'Basic', 2, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Извлечение ключевых идей из документа', 'Basic', 3, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Категоризация информации', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Создание шаблонов документов', 'Pro', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Поиск по базе знаний с AI', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Версионирование документов', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Аудит и оптимизация базы знаний', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Построение графа знаний', 'AI-Native', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Семантический поиск по документам', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'knowledge-management'), 'Автоматическое обновление знаний', 'AI-Native', 11, null),
  
  -- Content Creation (demo-skill-3)
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Написание статьи с AI', 'Basic', 1, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Генерация идей для контента', 'Basic', 2, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Редактирование текста с помощью AI', 'Basic', 3, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Адаптация контента под платформу', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Создание контент-плана', 'Pro', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'SEO-оптимизация контента', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Мультиформатный контент', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'A/B тестирование заголовков', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Персонализация контента', 'AI-Native', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Автоматизация публикаций', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'content-creation'), 'Генерация мультимедийного контента', 'AI-Native', 11, null),
  
  -- Problem Solving (demo-skill-4)
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Структурирование проблемы', 'Basic', 1, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Генерация альтернативных решений', 'Basic', 2, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'SWOT-анализ с помощью AI', 'Basic', 3, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Оценка рисков решения', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Принятие решения на основе данных', 'Pro', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Сценарное планирование', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Декомпозиция сложных задач', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Приоритизация с методом RICE', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Предиктивная аналитика решений', 'AI-Native', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Оптимизация с помощью AI', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'problem-solving'), 'Системное мышление с AI', 'AI-Native', 11, null),
  
  -- Research (demo-skill-5)
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Глубокое исследование темы', 'Basic', 1, 'deep-research'),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Анализ документов и извлечение данных', 'Basic', 2, 'document-analysis'),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Анализ конкурентов', 'Basic', 3, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Извлечение данных из источников', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Валидация информации', 'Basic', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Синтез информации из разных источников', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Создание аналитического отчета', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Поиск трендов и паттернов', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Fact-checking с AI', 'Pro', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Автоматический мониторинг источников', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Построение исследовательских гипотез', 'AI-Native', 11, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Семантический анализ текстов', 'AI-Native', 12, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'research'), 'Интеллектуальная агрегация данных', 'AI-Native', 13, null),
  
  -- Automation (demo-skill-6)
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Идентификация процессов для автоматизации', 'Basic', 1, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Создание простого workflow', 'Basic', 2, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Автоматизация email-рассылок', 'Basic', 3, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Обработка данных в таблицах', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Интеграция сервисов через API', 'Pro', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Создание чат-ботов', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Автоматизация отчетности', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Workflow для обработки документов', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Построение AI-агентов', 'AI-Native', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Оркестрация сложных процессов', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'automation'), 'Самообучающаяся автоматизация', 'AI-Native', 11, null),
  
  -- Data Analysis (demo-skill-7)
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Анализ документов и таблиц', 'Basic', 1, 'document-analysis'),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Создание базовых графиков', 'Basic', 2, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Описательная статистика', 'Basic', 3, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Выявление аномалий в данных', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Корреляционный анализ', 'Pro', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Создание дашбордов', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Анализ временных рядов', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'A/B тестирование', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Предиктивная аналитика', 'AI-Native', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Интерактивная визуализация', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'data-analysis'), 'Natural Language to SQL', 'AI-Native', 11, null),
  
  -- Productivity (demo-skill-8)
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Планирование дня с AI', 'Basic', 1, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Управление задачами', 'Basic', 2, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Анализ использования времени', 'Basic', 3, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Делегирование задач AI', 'Basic', 4, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Создание личной системы продуктивности', 'Pro', 5, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Автоматизация рутинных задач', 'Pro', 6, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Оптимизация рабочих процессов', 'Pro', 7, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Фокус-менеджмент', 'Pro', 8, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'AI-ассистент для повседневных задач', 'AI-Native', 9, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Персонализированные рекомендации', 'AI-Native', 10, null),
  ((SELECT id FROM skill_mapping WHERE slug = 'productivity'), 'Адаптивное планирование с AI', 'AI-Native', 11, null);