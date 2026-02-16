
# Исправление двух проблем дизайна

## Проблема 1: Жирный текст из AI отображается как `**текст**`

AI возвращает markdown-форматирование (`**жирный текст**`), но на фронтенде текст рендерится как plain text через `{message.content}`.

### Решение

Создать утилитную функцию `formatMarkdownBold()`, которая заменяет `**текст**` на `<strong>текст</strong>` и рендерит результат через React-элементы (без `dangerouslySetInnerHTML`).

### Затронутые файлы

**1. `src/components/PromptTester.tsx`** (строка 280)
- Заменить `{message.content}` на вызов функции форматирования, которая парсит `**...**` в `<strong>` теги
- Применяется только к AI-сообщениям (type === 'ai')

**2. Все 5 страниц заданий** с чат-режимом тьютора:
- `src/pages/TaskClientResponse.tsx`
- `src/pages/TaskFeedback.tsx`
- `src/pages/TaskMeetingAgenda.tsx`
- `src/pages/TaskDocumentAnalysis.tsx`
- `src/pages/TaskDeepResearch.tsx`

В каждой из них функция `formatAssistantMessage()` разбивает текст на параграфы, но не обрабатывает bold-маркеры. Добавить обработку `**...**` при рендере параграфов тьютора.

**3. `src/lib/utils.ts`** -- добавить общую функцию `renderFormattedText(text: string)`, возвращающую массив React-элементов (`ReactNode[]`), чтобы переиспользовать во всех компонентах.

---

## Проблема 2: Чат-окно тьютора "висит" без карточки после сдачи задания

При нажатии "Сдать задание" в `BlurredAnswerBlock` срабатывает `onSubmit`, который устанавливает `isChatMode = true`. После этого `BlurredAnswerBlock` заменяется на чат-секцию, но чат рендерится без обёртки `Card` -- просто `div` с сообщениями на фоне страницы.

### Решение

Обернуть чат-режим (`isChatMode === true`) в `Card` с заголовком "Чат с тьютором", чтобы визуально он выглядел как остальные карточки на странице.

### Затронутые файлы (те же 5 страниц):
- `src/pages/TaskClientResponse.tsx` (строки 302-356)
- `src/pages/TaskFeedback.tsx` (строки 320-374)
- `src/pages/TaskMeetingAgenda.tsx`
- `src/pages/TaskDocumentAnalysis.tsx`
- `src/pages/TaskDeepResearch.tsx`

В каждой заменить:
```
) : (
  <div className="space-y-4">
    ...chat messages...
  </div>
)
```
на:
```
) : (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-foreground mb-4">Чат с тьютором</h3>
    <div className="space-y-4">
      ...chat messages...
    </div>
  </Card>
)
```

---

## Итого: 7 файлов
- `src/lib/utils.ts` -- новая функция `renderFormattedText`
- `src/components/PromptTester.tsx` -- форматирование AI-сообщений
- 5 страниц заданий -- форматирование тьютор-сообщений + обёртка чата в Card
