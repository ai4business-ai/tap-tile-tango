
# Исправление отступа на странице "Теория"

## Проблема
Страница `WebinarRecords.tsx` имеет собственные отступы `p-4 md:p-6 lg:p-8` и контейнер `md:max-w-md mx-auto`, которые дублируют то, что уже задает Layout. Это создает двойной padding сверху, из-за чего контент "Теория" отодвинут от header дальше, чем на других страницах.

## Решение

**Файл: `src/pages/WebinarRecords.tsx`** (строка 87)

Убрать `p-4 md:p-6 lg:p-8 md:max-w-md mx-auto` из корневого div, оставив только `min-h-screen`:

```tsx
// Было:
<div className="min-h-screen p-4 md:p-6 lg:p-8 md:max-w-md mx-auto">

// Станет:
<div className="min-h-screen">
```

Layout уже оборачивает контент в `max-w-md mx-auto px-4`, поэтому дублирование не нужно. Остальные страницы не затрагиваются.
