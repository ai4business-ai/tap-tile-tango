
# Унификация ширины контента на всех страницах

## Проблема
Layout уже оборачивает `{children}` в `<div className="max-w-md mx-auto px-4">`, но большинство страниц дублируют `px-4`, `max-w-md mx-auto` внутри себя. Это создает двойной padding (32px вместо 16px с каждой стороны), из-за чего контент уже, чем на странице "Теория", которая не дублирует эти стили.

## Решение
Убрать дублирующие `px-4`, `max-w-md mx-auto` из корневых div всех страниц, оставив только специфичные классы. Layout обеспечивает единый контейнер.

## Изменения по файлам

### Простые страницы (убрать px-4, max-w-md, mx-auto из корневого div)

| Файл | Было | Станет |
|------|------|--------|
| `Tasks.tsx` (стр. 78) | `min-h-screen px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 md:max-w-md mx-auto` | `min-h-screen` |
| `TasksDemo.tsx` (стр. 82) | `min-h-screen px-4 pb-24 md:max-w-md mx-auto` | `min-h-screen` |
| `TaskSpecializedGPT.tsx` (стр. 15) | `min-h-screen px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 w-full md:max-w-md mx-auto overflow-x-hidden` | `min-h-screen` |
| `TaskDocumentAnalysis.tsx` (стр. 292) | аналогично | `min-h-screen` |
| `TaskDeepResearch.tsx` (стр. 119) | аналогично | `min-h-screen` |
| `TaskClientResponse.tsx` (стр. 119) | аналогично | `min-h-screen` |
| `TaskClientResponseDemo.tsx` (стр. 14) | `min-h-screen bg-[#FFFFFF] px-4 pb-8 pt-4 w-full md:max-w-md mx-auto` | `min-h-screen` |
| `TaskMeetingAgenda.tsx` (стр. 123) | аналогично | `min-h-screen` |
| `TaskFeedback.tsx` (стр. 119) | аналогично | `min-h-screen` |
| `PromptsLibrary.tsx` (стр. 67) | `min-h-screen px-4 pb-24 md:max-w-md mx-auto` | `min-h-screen` |
| `SkillAssignmentsDemo.tsx` (стр. 76) | `min-h-screen px-4 pb-24 md:max-w-md mx-auto` | `min-h-screen` |
| `MyProgress.tsx` (стр. 96) | `max-w-md mx-auto px-4 pb-24` | убрать `max-w-md mx-auto px-4`, оставить `pb-24` |

### Страница SkillAssignments (вложенный контейнер)
`SkillAssignments.tsx` (стр. 77): убрать обертку `<div className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 md:max-w-md mx-auto">` -- перенести содержимое напрямую в корневой div.

### Страницы с полноширинными цветными блоками (Index, Demo, IndexPlayground)
Эти страницы имеют фиолетовый header на всю ширину и собственный header, поэтому их `max-w-md mx-auto px-4` внутри цветных секций нужны. Но контентная область ниже (стр. 110 в Index, 195 в Demo, 133 в IndexPlayground) дублирует `max-w-md mx-auto px-4` -- убрать из нее `max-w-md mx-auto`, оставить только `px-4` для контента внутри цветных секций.

Однако эти страницы -- особый случай: их цветные секции выходят за пределы контейнера Layout, поэтому им по-прежнему нужен внутренний `max-w-md`. Их лучше не трогать сейчас, чтобы не сломать верстку.

### Страницы PromptsBySkill и BasicPrompts
Аналогично Index/Demo -- имеют цветные full-width секции с `max-w-md mx-auto px-4` внутри. Не трогаем.

## Итого: 12 файлов для правки
Убираем дублирующие `px-4`, `max-w-md mx-auto` из корневых div обычных страниц, не затрагивая страницы с кастомными цветными секциями.
