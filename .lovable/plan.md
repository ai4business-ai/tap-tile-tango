

# Стандартизация блока сдачи задания (BlurredAnswerBlock)

## Текущая ситуация

Сейчас 6 страниц заданий используют разные подходы к блоку сдачи:

| Страница | Блок сдачи | Блюр-эффект |
|---|---|---|
| TaskDocumentAnalysis | BlurredAnswerBlock | Да |
| TaskDeepResearch | BlurredAnswerBlock | Да |
| TaskSpecializedGPT | BlurredAnswerBlock | Да |
| TaskClientResponse | Своя Card + Textarea + Button | Нет |
| TaskFeedback | Своя Card + Textarea + Button | Нет |
| TaskMeetingAgenda | Своя Card + 2 Textarea + Button | Нет |

## Что делаем

Заменяем все кастомные блоки сдачи на единый `BlurredAnswerBlock` в трёх оставшихся заданиях. Для TaskMeetingAgenda (у которого 2 поля ввода -- адженда и follow-up) расширяем компонент, добавив поддержку дополнительного поля через опциональные пропсы.

## Технические изменения

### 1. `src/components/BlurredAnswerBlock.tsx`
Добавить опциональные пропсы для второго поля ввода:
- `secondValue`, `onSecondChange`, `secondPlaceholder`, `secondLabel` -- для задач с двумя полями (TaskMeetingAgenda)
- `secondMaxLength` (по умолчанию 2000)

Если `secondValue`/`onSecondChange` переданы, между двумя текстовыми полями отображается разделитель и второе поле со своим счётчиком символов.

### 2. `src/pages/TaskClientResponse.tsx`
Заменить блок с `Card > Textarea + Button` (строки 288-325) на `BlurredAnswerBlock` с параметрами:
- `taskDescription`: "Напишите промпт, который поможет ИИ создать идеальное письмо клиенту"
- `placeholder`: "Напишите промпт, который поможет ИИ создать идеальное письмо клиенту..."

### 3. `src/pages/TaskFeedback.tsx`
Заменить аналогичный блок (строки 306-343) на `BlurredAnswerBlock`:
- `taskDescription`: "Напишите промпт для составления конструктивной обратной связи юристам"
- `placeholder`: "Напишите промпт, который поможет ИИ создать конструктивное письмо юристам..."

### 4. `src/pages/TaskMeetingAgenda.tsx`
Заменить блок с двумя Textarea (строки 325-381) на `BlurredAnswerBlock` с двумя полями:
- Первое поле: адженда (`agendaPrompt`)
- Второе поле: follow-up (`followupPrompt`)
- При сдаче объединяются в один текст, как сейчас

## Итого: 4 файла (1 компонент + 3 страницы задания)

