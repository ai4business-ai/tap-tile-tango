export interface DemoSkill {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  current_level: number;
  target_level: number;
  progress_percent: number;
  is_goal_achieved: boolean;
}

export interface DemoAssignment {
  id: string;
  skill_id: string;
  title: string;
  level: string;
  order_index: number;
  task_id: string | null;
}

export const demoSkills: DemoSkill[] = [
  {
    id: 'demo-skill-1',
    name: 'Коммуникация и работа в команде',
    slug: 'communication',
    description: 'Навыки эффективной коммуникации с помощью AI',
    order_index: 1,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
  {
    id: 'demo-skill-2',
    name: 'Управление знаниями',
    slug: 'knowledge-management',
    description: 'Организация и управление информацией с AI',
    order_index: 2,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
  {
    id: 'demo-skill-3',
    name: 'Создание контента',
    slug: 'content-creation',
    description: 'Генерация и создание контента с помощью AI',
    order_index: 3,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
  {
    id: 'demo-skill-4',
    name: 'Решение задач и принятие решений',
    slug: 'problem-solving',
    description: 'Аналитическое мышление и принятие решений с AI',
    order_index: 4,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
  {
    id: 'demo-skill-5',
    name: 'Исследования и обработка информации',
    slug: 'research',
    description: 'Поиск и анализ информации с помощью AI',
    order_index: 5,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
  {
    id: 'demo-skill-6',
    name: 'Автоматизация процессов',
    slug: 'automation',
    description: 'Автоматизация рутинных задач с AI',
    order_index: 6,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
  {
    id: 'demo-skill-7',
    name: 'Анализ и визуализация данных',
    slug: 'data-analysis',
    description: 'Работа с данными и их визуализация с AI',
    order_index: 7,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
  {
    id: 'demo-skill-8',
    name: 'Продуктивность',
    slug: 'productivity',
    description: 'Повышение личной эффективности с помощью AI',
    order_index: 8,
    current_level: 1,
    target_level: 1,
    progress_percent: 0,
    is_goal_achieved: false,
  },
];

export const demoAssignments: DemoAssignment[] = [
  // Коммуникация и работа в команде (11 заданий)
  { id: 'demo-assign-1-1', skill_id: 'demo-skill-1', title: 'Составление эффективного письма', level: 'Basic', order_index: 1, task_id: 'client-response' },
  { id: 'demo-assign-1-2', skill_id: 'demo-skill-1', title: 'Подготовка повестки встречи', level: 'Basic', order_index: 2, task_id: 'meeting-agenda' },
  { id: 'demo-assign-1-3', skill_id: 'demo-skill-1', title: 'Формулирование обратной связи', level: 'Basic', order_index: 3, task_id: 'feedback-colleagues' },
  { id: 'demo-assign-1-4', skill_id: 'demo-skill-1', title: 'Создание презентации идеи', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-1-5', skill_id: 'demo-skill-1', title: 'Адаптация сообщения под аудиторию', level: 'Pro', order_index: 5, task_id: null },
  { id: 'demo-assign-1-6', skill_id: 'demo-skill-1', title: 'Разрешение конфликта в команде', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-1-7', skill_id: 'demo-skill-1', title: 'Модерация групповой дискуссии', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-1-8', skill_id: 'demo-skill-1', title: 'Кросс-культурная коммуникация', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-1-9', skill_id: 'demo-skill-1', title: 'Создание коммуникационной стратегии', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-1-10', skill_id: 'demo-skill-1', title: 'Анализ тональности коммуникаций', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-1-11', skill_id: 'demo-skill-1', title: 'Автоматизация внутренних коммуникаций', level: 'AI-Native', order_index: 11, task_id: null },

  // Управление знаниями (11 заданий)
  { id: 'demo-assign-2-1', skill_id: 'demo-skill-2', title: 'Систематизация документов', level: 'Basic', order_index: 1, task_id: null },
  { id: 'demo-assign-2-2', skill_id: 'demo-skill-2', title: 'Создание базы знаний', level: 'Basic', order_index: 2, task_id: null },
  { id: 'demo-assign-2-3', skill_id: 'demo-skill-2', title: 'Извлечение ключевых идей из документа', level: 'Basic', order_index: 3, task_id: null },
  { id: 'demo-assign-2-4', skill_id: 'demo-skill-2', title: 'Категоризация информации', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-2-5', skill_id: 'demo-skill-2', title: 'Создание шаблонов документов', level: 'Pro', order_index: 5, task_id: null },
  { id: 'demo-assign-2-6', skill_id: 'demo-skill-2', title: 'Поиск по базе знаний с AI', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-2-7', skill_id: 'demo-skill-2', title: 'Версионирование документов', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-2-8', skill_id: 'demo-skill-2', title: 'Аудит и оптимизация базы знаний', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-2-9', skill_id: 'demo-skill-2', title: 'Построение графа знаний', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-2-10', skill_id: 'demo-skill-2', title: 'Семантический поиск по документам', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-2-11', skill_id: 'demo-skill-2', title: 'Автоматическое обновление знаний', level: 'AI-Native', order_index: 11, task_id: null },

  // Создание контента (11 заданий)
  { id: 'demo-assign-3-1', skill_id: 'demo-skill-3', title: 'Написание статьи с AI', level: 'Basic', order_index: 1, task_id: null },
  { id: 'demo-assign-3-2', skill_id: 'demo-skill-3', title: 'Генерация идей для контента', level: 'Basic', order_index: 2, task_id: null },
  { id: 'demo-assign-3-3', skill_id: 'demo-skill-3', title: 'Редактирование текста с помощью AI', level: 'Basic', order_index: 3, task_id: null },
  { id: 'demo-assign-3-4', skill_id: 'demo-skill-3', title: 'Адаптация контента под платформу', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-3-5', skill_id: 'demo-skill-3', title: 'Создание контент-плана', level: 'Pro', order_index: 5, task_id: null },
  { id: 'demo-assign-3-6', skill_id: 'demo-skill-3', title: 'SEO-оптимизация контента', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-3-7', skill_id: 'demo-skill-3', title: 'Мультиформатный контент', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-3-8', skill_id: 'demo-skill-3', title: 'A/B тестирование заголовков', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-3-9', skill_id: 'demo-skill-3', title: 'Персонализация контента', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-3-10', skill_id: 'demo-skill-3', title: 'Автоматизация публикаций', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-3-11', skill_id: 'demo-skill-3', title: 'Генерация мультимедийного контента', level: 'AI-Native', order_index: 11, task_id: null },

  // Решение задач и принятие решений (11 заданий)
  { id: 'demo-assign-4-1', skill_id: 'demo-skill-4', title: 'Структурирование проблемы', level: 'Basic', order_index: 1, task_id: null },
  { id: 'demo-assign-4-2', skill_id: 'demo-skill-4', title: 'Генерация альтернативных решений', level: 'Basic', order_index: 2, task_id: null },
  { id: 'demo-assign-4-3', skill_id: 'demo-skill-4', title: 'SWOT-анализ с помощью AI', level: 'Basic', order_index: 3, task_id: null },
  { id: 'demo-assign-4-4', skill_id: 'demo-skill-4', title: 'Оценка рисков решения', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-4-5', skill_id: 'demo-skill-4', title: 'Принятие решения на основе данных', level: 'Pro', order_index: 5, task_id: null },
  { id: 'demo-assign-4-6', skill_id: 'demo-skill-4', title: 'Сценарное планирование', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-4-7', skill_id: 'demo-skill-4', title: 'Декомпозиция сложных задач', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-4-8', skill_id: 'demo-skill-4', title: 'Приоритизация с методом RICE', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-4-9', skill_id: 'demo-skill-4', title: 'Предиктивная аналитика решений', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-4-10', skill_id: 'demo-skill-4', title: 'Оптимизация с помощью AI', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-4-11', skill_id: 'demo-skill-4', title: 'Системное мышление с AI', level: 'AI-Native', order_index: 11, task_id: null },

  // Исследования и обработка информации (13 заданий)
  { id: 'demo-assign-5-1', skill_id: 'demo-skill-5', title: 'Глубокое исследование темы', level: 'Basic', order_index: 1, task_id: 'deep-research' },
  { id: 'demo-assign-5-2', skill_id: 'demo-skill-5', title: 'Анализ документов и извлечение данных', level: 'Basic', order_index: 2, task_id: 'document-analysis' },
  { id: 'demo-assign-5-3', skill_id: 'demo-skill-5', title: 'Анализ конкурентов', level: 'Basic', order_index: 3, task_id: null },
  { id: 'demo-assign-5-4', skill_id: 'demo-skill-5', title: 'Извлечение данных из источников', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-5-5', skill_id: 'demo-skill-5', title: 'Валидация информации', level: 'Basic', order_index: 5, task_id: null },
  { id: 'demo-assign-5-6', skill_id: 'demo-skill-5', title: 'Синтез информации из разных источников', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-5-7', skill_id: 'demo-skill-5', title: 'Создание аналитического отчета', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-5-8', skill_id: 'demo-skill-5', title: 'Поиск трендов и паттернов', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-5-9', skill_id: 'demo-skill-5', title: 'Fact-checking с AI', level: 'Pro', order_index: 9, task_id: null },
  { id: 'demo-assign-5-9', skill_id: 'demo-skill-5', title: 'Автоматический мониторинг источников', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-5-10', skill_id: 'demo-skill-5', title: 'Построение исследовательских гипотез', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-5-11', skill_id: 'demo-skill-5', title: 'Семантический анализ текстов', level: 'AI-Native', order_index: 11, task_id: null },
  { id: 'demo-assign-5-12', skill_id: 'demo-skill-5', title: 'Интеллектуальная агрегация данных', level: 'AI-Native', order_index: 12, task_id: null },

  // Автоматизация процессов (11 заданий)
  { id: 'demo-assign-6-1', skill_id: 'demo-skill-6', title: 'Идентификация процессов для автоматизации', level: 'Basic', order_index: 1, task_id: null },
  { id: 'demo-assign-6-2', skill_id: 'demo-skill-6', title: 'Создание простого workflow', level: 'Basic', order_index: 2, task_id: null },
  { id: 'demo-assign-6-3', skill_id: 'demo-skill-6', title: 'Автоматизация email-рассылок', level: 'Basic', order_index: 3, task_id: null },
  { id: 'demo-assign-6-4', skill_id: 'demo-skill-6', title: 'Обработка данных в таблицах', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-6-5', skill_id: 'demo-skill-6', title: 'Интеграция сервисов через API', level: 'Pro', order_index: 5, task_id: null },
  { id: 'demo-assign-6-6', skill_id: 'demo-skill-6', title: 'Создание чат-ботов', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-6-7', skill_id: 'demo-skill-6', title: 'Автоматизация отчетности', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-6-8', skill_id: 'demo-skill-6', title: 'Workflow для обработки документов', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-6-9', skill_id: 'demo-skill-6', title: 'Построение AI-агентов', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-6-10', skill_id: 'demo-skill-6', title: 'Оркестрация сложных процессов', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-6-11', skill_id: 'demo-skill-6', title: 'Самообучающаяся автоматизация', level: 'AI-Native', order_index: 11, task_id: null },

  // Анализ и визуализация данных (11 заданий)
  { id: 'demo-assign-7-1', skill_id: 'demo-skill-7', title: 'Анализ документов и таблиц', level: 'Basic', order_index: 1, task_id: 'document-analysis' },
  { id: 'demo-assign-7-2', skill_id: 'demo-skill-7', title: 'Создание базовых графиков', level: 'Basic', order_index: 2, task_id: null },
  { id: 'demo-assign-7-3', skill_id: 'demo-skill-7', title: 'Описательная статистика', level: 'Basic', order_index: 3, task_id: null },
  { id: 'demo-assign-7-4', skill_id: 'demo-skill-7', title: 'Выявление аномалий в данных', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-7-5', skill_id: 'demo-skill-7', title: 'Корреляционный анализ', level: 'Pro', order_index: 5, task_id: null },
  { id: 'demo-assign-7-6', skill_id: 'demo-skill-7', title: 'Создание дашбордов', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-7-7', skill_id: 'demo-skill-7', title: 'Анализ временных рядов', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-7-8', skill_id: 'demo-skill-7', title: 'A/B тестирование', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-7-9', skill_id: 'demo-skill-7', title: 'Предиктивная аналитика', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-7-10', skill_id: 'demo-skill-7', title: 'Интерактивная визуализация', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-7-11', skill_id: 'demo-skill-7', title: 'Natural Language to SQL', level: 'AI-Native', order_index: 11, task_id: null },

  // Продуктивность (11 заданий)
  { id: 'demo-assign-8-1', skill_id: 'demo-skill-8', title: 'Планирование дня с AI', level: 'Basic', order_index: 1, task_id: null },
  { id: 'demo-assign-8-2', skill_id: 'demo-skill-8', title: 'Управление задачами', level: 'Basic', order_index: 2, task_id: null },
  { id: 'demo-assign-8-3', skill_id: 'demo-skill-8', title: 'Анализ использования времени', level: 'Basic', order_index: 3, task_id: null },
  { id: 'demo-assign-8-4', skill_id: 'demo-skill-8', title: 'Делегирование задач AI', level: 'Basic', order_index: 4, task_id: null },
  { id: 'demo-assign-8-5', skill_id: 'demo-skill-8', title: 'Создание личной системы продуктивности', level: 'Pro', order_index: 5, task_id: null },
  { id: 'demo-assign-8-6', skill_id: 'demo-skill-8', title: 'Автоматизация рутинных задач', level: 'Pro', order_index: 6, task_id: null },
  { id: 'demo-assign-8-7', skill_id: 'demo-skill-8', title: 'Оптимизация рабочих процессов', level: 'Pro', order_index: 7, task_id: null },
  { id: 'demo-assign-8-8', skill_id: 'demo-skill-8', title: 'Фокус-менеджмент', level: 'Pro', order_index: 8, task_id: null },
  { id: 'demo-assign-8-9', skill_id: 'demo-skill-8', title: 'AI-ассистент для повседневных задач', level: 'AI-Native', order_index: 9, task_id: null },
  { id: 'demo-assign-8-10', skill_id: 'demo-skill-8', title: 'Персонализированные рекомендации', level: 'AI-Native', order_index: 10, task_id: null },
  { id: 'demo-assign-8-11', skill_id: 'demo-skill-8', title: 'Адаптивное планирование с AI', level: 'AI-Native', order_index: 11, task_id: null },
];
