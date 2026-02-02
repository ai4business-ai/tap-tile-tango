
# План по запуску приложения после паузы

## Текущее состояние

### Что работает:
- **База данных**: 8 навыков, 90 заданий, данные пользователей
- **Edge Functions**: `prompt-tester`, `chat-assistant`, `set-user-environment` - все развернуты и отвечают
- **Аутентификация**: Google OAuth + Email/Password через Supabase Auth
- **UI**: Главная страница, страницы заданий, прогресс пользователя

### Обнаруженные предупреждения:
1. **RLS без политик** - на некоторых таблицах включен RLS, но нет политик (INFO)
2. **OTP expiry** - длинное время жизни OTP (WARN)
3. **Leaked Password Protection отключена** (WARN)
4. **Обновление Postgres** - есть security patches (WARN)

---

## Чек-лист запуска

### 1. Проверка безопасности (рекомендуется)
- [ ] Включить Leaked Password Protection в настройках Supabase Auth
- [ ] Уменьшить время жизни OTP токенов
- [ ] Обновить Postgres версию в Supabase Dashboard
- [ ] Проверить RLS политики на всех таблицах

### 2. Тестирование функционала
- [ ] Проверить вход через Google OAuth
- [ ] Проверить регистрацию/вход по email
- [ ] Пройти одно задание от начала до конца
- [ ] Проверить работу тестирования промптов на `/task/client-response/demo`
- [ ] Убедиться что прогресс сохраняется

### 3. Контент и данные
- [ ] Убедиться что все 90 заданий заполнены корректно
- [ ] Проверить что все 8 навыков отображаются
- [ ] Проверить материалы заданий (PDF документы)

### 4. Публикация
- [ ] Нажать **Publish → Update** для деплоя frontend
- [ ] Проверить production URL: https://ai-training-beeline.lovable.app

---

## Техническая информация

```text
База данных:
├── skills: 8 записей
├── assignments: 90 записей  
├── user_skills: 24 записей
├── user_assignment_submissions: 1 запись
├── documents: файлы заданий
└── prompt_attempts: попытки тестирования

Edge Functions:
├── prompt-tester - проверка промптов с AI
├── chat-assistant - чат с ассистентом
└── set-user-environment - установка окружения (dev/prod)
```

---

## Рекомендуемый порядок действий

1. Зайти на https://supabase.com/dashboard/project/nhxrajtfxavkkzqyfrok/auth/providers и проверить настройки Auth
2. Протестировать приложение в preview режиме
3. Исправить критические предупреждения безопасности
4. Нажать Publish для обновления production версии
