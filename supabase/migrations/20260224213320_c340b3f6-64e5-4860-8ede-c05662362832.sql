
-- Insert vibecoding course
INSERT INTO courses (title, slug, description, course_type, is_published, order_index)
VALUES (
  'Вайбкодинг: от идеи до продукта',
  'vibecoding',
  '8-недельный практический курс по созданию IT-продуктов с помощью AI без знания кода. От идеи до первых пользователей.',
  'theory_practice',
  true,
  1
);

-- Insert 9 modules
DO $$
DECLARE
  v_course_id uuid;
  v_m0 uuid; v_m1 uuid; v_m2 uuid; v_m3 uuid; v_m4 uuid; v_m5 uuid; v_m6 uuid; v_m7 uuid; v_m8 uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'vibecoding';

  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'ИИ: от хайпа к реальным продуктам', 'Вводный вебинар. Фундамент: ИИ под капотом, обзор рынка, промпт-инжиниринг, ИИ-агенты, вайб-кодинг и безопасность.', 0) RETURNING id INTO v_m0;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'Что такое вайб-кодинг', 'Смена мышления и роли. Метафора айсберга, новая роль создателя, галерея кейсов, first one-shot генерация.', 1) RETURNING id INTO v_m1;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'Как управлять AI', 'Тренажер вайб-кодера и дебаг. Итеративный цикл, ограничения, дебаг для не-программистов.', 2) RETURNING id INTO v_m2;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'Выбор идеи + PRD для MVP', 'Как выбрать идею, сформулировать ценность, написать PRD и сделать oneshot-генерацию лендинга.', 3) RETURNING id INTO v_m3;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'Работа с кодом + дизайн системы', 'Lovable, Claude Code, деплой, дизайн-системы, Figma MCP.', 4) RETURNING id INTO v_m4;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'Cybos + Agentic AI', 'Создание агентов, подключение API/MCP, работа в Git, swarm-команды.', 5) RETURNING id INTO v_m5;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'От прототипа к продакшену', 'Архитектура, безопасность, деплой. SDLC, quality gates, чек-лист безопасности.', 6) RETURNING id INTO v_m6;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'Упаковка и go-to-market', 'Маркетинг, креативы, SEO/GEO, метрика, платежи. 3 варианта трека.', 7) RETURNING id INTO v_m7;
  INSERT INTO course_modules (course_id, title, description, order_index) VALUES
    (v_course_id, 'Первый цикл обратной связи', 'Как собрать фидбек, что улучшать, план масштабирования или пивота.', 8) RETURNING id INTO v_m8;

  -- Module 0 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m0, 'Вебинар: ИИ от хайпа к реальным продуктам', 'theory', 0, '{
      "duration": "2 часа",
      "blocks": [
        {"type": "heading", "content": "Блок 1. Фундамент: как работает ИИ и обзор рынка"},
        {"type": "list", "items": ["Как устроен ИИ «под капотом» (ML, нейросети, LLM)", "Токены и контекстное окно", "Обзор топ-5 мировых нейросетей и российских аналогов", "Базовая ИБ-гигиена"]},
        {"type": "heading", "content": "Блок 2. Промпт-инжиниринг"},
        {"type": "list", "items": ["Анатомия идеального промпта", "Техника «Цепочка рассуждений»", "Обучение на примерах"]},
        {"type": "heading", "content": "Блок 3. ИИ-агенты и No-code автоматизация"},
        {"type": "list", "items": ["Эволюция от чат-ботов к автономным агентам", "Обзор No-code платформ (n8n, Make, Zapier)", "Логика построения ИИ-цепочек"]},
        {"type": "heading", "content": "Блок 4. Вайб-кодинг"},
        {"type": "list", "items": ["Что такое вайб-кодинг", "Обзор инструментов (Lovable, Bolt, Replit, Cursor)", "Что можно создать самому", "Главные правила вайб-кодера"]},
        {"type": "heading", "content": "Блок 5. Безопасность и красные линии"},
        {"type": "list", "items": ["Не передавать персональные данные", "Не делиться аккаунтами", "Не загружать конфиденциальные данные", "Проверять что отправляете в нейронку"]}
      ],
      "homework": {
        "title": "Вводная домашка (30-60 мин, необязательная)",
        "tasks": ["Зарегистрироваться в 2-3 ключевых нейросетях", "Найти/выпустить иностранную карту для оплаты подписки"]
      },
      "tools": ["ChatGPT", "Claude", "Gemini", "DeepSeek"]
    }'::jsonb),
    (v_m0, 'Live-демо: сборка без кода в прямом эфире', 'practice', 1, '{
      "duration": "30 минут",
      "blocks": [
        {"type": "text", "content": "Сборка простой автоматизации или интерфейса в прямом эфире без знания кода."},
        {"type": "callout", "variant": "info", "content": "Презентация курса и Q&A: как пройти путь от идеи до первых пользователей за месяц."}
      ],
      "tools": ["Lovable"]
    }'::jsonb);

  -- Module 1 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m1, 'Mindset shift: смена мышления', 'theory', 0, '{
      "duration": "1.5-2 часа",
      "blocks": [
        {"type": "heading", "content": "Mindset shift — 30 минут"},
        {"type": "text", "content": "Разбираем метафору айсберга и новую роль создателя. Почему учить язык программирования больше не нужно, а учиться системно мыслить — обязательно."},
        {"type": "heading", "content": "Галерея кейсов — 30 минут"},
        {"type": "text", "content": "Обсуждаем 5-10 реальных историй: микро-CRM, Telegram-бот, трекер привычек, календарь эмоций, личная ОС жизни."},
        {"type": "heading", "content": "Live-практика (one-shot) — 30 минут"},
        {"type": "text", "content": "Открываем Lovable и делаем первый запрос на генерацию лендинга одной кнопкой."},
        {"type": "heading", "content": "Интерактив — до 30 минут"},
        {"type": "text", "content": "Участники пробуют сгенерировать свой проект, делимся ссылками в чате."}
      ],
      "homework": {
        "title": "Самостоятельная работа (1-2 часа)",
        "tasks": ["Заполнить подробную форму (запросы, цели на курс, уровень опыта)", "«Слепой тест-драйв»: доделать свой лендинг в Lovable (добавить кнопки, поменять цвета, вставить блоки)"]
      },
      "tools": ["Lovable"]
    }'::jsonb);

  -- Module 2 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m2, 'Тренажер вайб-кодера и дебаг', 'practice', 0, '{
      "duration": "1.5-2 часа",
      "blocks": [
        {"type": "heading", "content": "Анатомия промпта для кода"},
        {"type": "text", "content": "Как писать инструкции, чтобы AI-кодер вас понял: описание логики, UI и стейтов."},
        {"type": "heading", "content": "Игра «Сломай и почини»"},
        {"type": "text", "content": "Берем простую задачу (таймер, список задач), генерируем, добавляем сложную фичу, ловим ошибку и учимся чинить."},
        {"type": "heading", "content": "Ограничения среды"},
        {"type": "text", "content": "Когда нужно разбить одну задачу на три маленьких — подготовка к архитектурному мышлению."}
      ],
      "homework": {
        "title": "Самостоятельная работа (1.5-2 часа)",
        "tasks": ["Сгенерировать 2 микро-аппки (калькулятор калорий, квиз и т.д.)", "Намеренно сломать аппку и восстановить с помощью AI", "Накидать 3-5 сырых идей для продукта к Модулю 3"]
      },
      "tools": ["Lovable", "Claude", "ChatGPT"]
    }'::jsonb);

  -- Module 3 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m3, 'Поиск идеи и исследование ЦА', 'practice', 0, '{
      "duration": "1.5 + 2 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Как искать идею продукта с AI (Deep Research + источники вдохновения)", "Изучение гипотез ЦА и потребностей с помощью AI (Wordstat, анализ Telegram, отзывы)"]},
        {"type": "heading", "content": "Домашнее задание (2 часа)"},
        {"type": "list", "items": ["Описать ЦА и их job stories с помощью AI", "Для проекта автоматизации — детализировать собственные хотелки"]}
      ],
      "tools": ["ChatGPT", "Claude", "Deep Research"]
    }'::jsonb),
    (v_m3, 'PRD для MVP + генерация прототипа', 'practice', 1, '{
      "duration": "1.5 + 2 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Формируем первую версию PRD с помощью AI", "Валидируем и ограничиваем MVP", "Генерируем первую версию в условиях ограничения по времени", "Прототип как постановка задачи на разработку"]},
        {"type": "heading", "content": "Домашнее задание (2 часа)"},
        {"type": "list", "items": ["Внести дополнения в PRD", "Доработать MVP в среде", "Использовать прототип как способ поставить задачу разработке"]}
      ],
      "tools": ["Lovable", "Claude"],
      "goal": "Получить готовый PRD продукта или продуктовой гипотезы которая нравится и драйвит"
    }'::jsonb);

  -- Module 4 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m4, 'Lovable и аналоги: продвинутый вайбкодинг', 'practice', 0, '{
      "duration": "1.5 + 4 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Все особенности и неочевидные способы вайбкодить на Lovable и аналогах", "Использование макетов, шаблонов, готовых UI kits", "Подключение базы данных + AI интерфейсов"]},
        {"type": "heading", "content": "Домашнее задание (4 часа)"},
        {"type": "list", "items": ["Улучшить дизайн приложения через дизайн-систему", "Подключить сервисы к лендингу"]}
      ],
      "tools": ["Lovable", "Claude Code", "Git"]
    }'::jsonb),
    (v_m4, 'Claude Code и деплой', 'practice', 1, '{
      "duration": "1.5 + 2 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Работа с Claude Code для написания кода", "Как задеплоить проект из Lovable локально", "Подключение Claude Code к проекту"]},
        {"type": "heading", "content": "Домашнее задание (2 часа)"},
        {"type": "list", "items": ["Сделать то же самое на своем проекте", "Получить стабильно работающий проект локально с подключенной БД"]}
      ],
      "tools": ["Claude Code", "Git", "Supabase"]
    }'::jsonb),
    (v_m4, 'Дизайн-система и Figma MCP', 'practice', 2, '{
      "duration": "1.5 + 4 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Создание собственной дизайн-системы на основе OpenSource", "Корпоративная дизайн-система (опция для IT-компаний)", "Подключение Figma MCP для кодинга"]},
        {"type": "heading", "content": "Домашнее задание (4 часа)"},
        {"type": "list", "items": ["Создать свою дизайн-систему компонентов", "Подключить и запустить Figma MCP", "Научиться строить макеты для вайбкодинга"]}
      ],
      "tools": ["Figma", "Claude Code", "21st.dev"]
    }'::jsonb);

  -- Module 5 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m5, 'Архитектура агентов и API/MCP', 'practice', 0, '{
      "duration": "1.5 + 4 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["База по архитектуре агентов", "Подключаем API/MCP от Telegram + Google Sheets + Buildin", "Делаем агента-планировщика задач"]},
        {"type": "heading", "content": "Домашнее задание (4 часа)"},
        {"type": "list", "items": ["Создать своего агента со своими ключами", "Решить задачу, которая перед вами стоит"]}
      ],
      "tools": ["Claude Code", "Telegram API", "Google Sheets"]
    }'::jsonb),
    (v_m5, 'Командная работа в Git', 'practice', 1, '{
      "duration": "1.5 + 4 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Как работать в гите вместе", "Создание совместного проекта", "Разделение контуров безопасности"]},
        {"type": "heading", "content": "Домашнее задание (4 часа)"},
        {"type": "list", "items": ["Сделать вдвоем один проект"]}
      ],
      "tools": ["Git", "GitHub", "Claude Code"]
    }'::jsonb),
    (v_m5, 'Swarm-команды агентов (бонус)', 'practice', 2, '{
      "duration": "1.5 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа, не обязателен)"},
        {"type": "list", "items": ["Подключаем swarm-команду для работы над проектами", "Уменьшаем количество кода", "Делаем решение дешевле, быстрее, с тем же качеством"]}
      ],
      "tools": ["Claude Code", "Swarm"]
    }'::jsonb);

  -- Module 6 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m6, 'Продуктовый цикл и SDLC', 'theory', 0, '{
      "duration": "1.5 + 2 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Трассировка", "Quality gates в разработке", "Агенты, проверяющие код", "Дрейф кода"]},
        {"type": "heading", "content": "Домашнее задание"},
        {"type": "list", "items": ["Добавить в проект циклы проверки", "Прогнать проект через цикл проверки", "Настроить пайплайн обновлений"]}
      ],
      "tools": ["Claude Code", "Git"]
    }'::jsonb),
    (v_m6, 'Безопасность', 'theory', 1, '{
      "duration": "1.5 + 2 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум (1.5 часа)"},
        {"type": "list", "items": ["Как проверять безопасность решения", "Как улучшать безопасность решения", "Чек-лист безопасности для корпоративного деплоя"]},
        {"type": "heading", "content": "Домашнее задание"},
        {"type": "list", "items": ["Проверить безопасность проекта", "Составить свой чек-лист проверки", "Внедрить аудит безопасности перед выкаткой"]}
      ],
      "tools": ["OWASP", "Claude Code"]
    }'::jsonb);

  -- Module 7 lessons (Track 1: Marketing)
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m7, 'Claude Code + Wordstat: маркетинговые тексты', 'practice', 0, '{
      "duration": "1.5 часа + ДЗ",
      "blocks": [
        {"type": "heading", "content": "Практикум"},
        {"type": "list", "items": ["Исследование запросов через Wordstat", "Адаптация лендинга под ЦА", "Создание агента-копирайтера для проекта"]},
        {"type": "heading", "content": "Домашнее задание"},
        {"type": "list", "items": ["Обновить описание проекта исходя из анализа", "Сделать агента для маркетинговых текстов"]}
      ],
      "tools": ["Claude Code", "Wordstat API"]
    }'::jsonb),
    (v_m7, 'Креативы для продукта с помощью AI', 'practice', 1, '{
      "duration": "1.5 часа + ДЗ",
      "blocks": [
        {"type": "heading", "content": "Практикум"},
        {"type": "list", "items": ["Создание креативов с помощью nanobanana", "Брендбук продукта для нейросетей", "Карточки в Gamma", "UGC style видео в Higgsfield"]},
        {"type": "heading", "content": "Домашнее задание"},
        {"type": "list", "items": ["Сделать контент для 2+ площадок с использованием брендбука"]}
      ],
      "tools": ["nanobanana", "Gamma", "Higgsfield"]
    }'::jsonb),
    (v_m7, 'Автоматизация генерации креативов', 'practice', 2, '{
      "duration": "1.5 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум"},
        {"type": "list", "items": ["AI-агент для генерации карточек", "Автопостинг", "n8n workflows для маркетингового контента"]}
      ],
      "tools": ["n8n", "Claude Code"]
    }'::jsonb),
    (v_m7, 'Метрика + SEO/GEO оптимизация', 'practice', 3, '{
      "duration": "1.5 часа + ДЗ",
      "blocks": [
        {"type": "heading", "content": "Практикум"},
        {"type": "list", "items": ["Подключение метрики к проекту", "Настройка целей через вайбкодинг", "SEO и GEO оптимизация", "Мониторинг позиций через API с помощью AI"]}
      ],
      "tools": ["Яндекс.Метрика", "Google Analytics", "Claude Code"]
    }'::jsonb),
    (v_m7, 'Подключение платежей', 'practice', 4, '{
      "duration": "1.5 часа",
      "blocks": [
        {"type": "heading", "content": "Практикум"},
        {"type": "list", "items": ["Подключаем платежи к проекту"]}
      ],
      "tools": ["Stripe", "ЮKassa"]
    }'::jsonb);

  -- Module 8 lessons
  INSERT INTO course_lessons (module_id, title, lesson_type, order_index, content_json) VALUES
    (v_m8, 'Первый цикл обратной связи', 'theory', 0, '{
      "duration": "1.5 часа",
      "blocks": [
        {"type": "heading", "content": "Содержание"},
        {"type": "list", "items": ["Как собрать фидбек", "Что улучшать в первую очередь", "План масштабирования или пивота"]},
        {"type": "callout", "variant": "success", "content": "Финальный результат: MVP + лендинг, первые пользователи/лиды/продажи, фреймворк для запуска следующих продуктов."}
      ],
      "tools": []
    }'::jsonb);

END $$;
