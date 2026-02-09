

# Единый контейнер ширины для всего приложения

## Проблема
Сейчас каждый компонент (TopHeader, GuestBanner, BottomNavigation, страницы) задает свою ширину отдельно через `max-w-md mx-auto px-4`. Из-за этого:
- Меню в header и нижняя навигация могут иметь разную ширину
- Нет единого "родительского блока", который контролирует ширину всего контента
- BottomNavigation до сих пор использует `max-w-2xl` вместо `max-w-md`

## Решение

### 1. Создать общий CSS-класс для контейнера
**Файл: `src/index.css`**

Добавить утилитарный класс:
```css
.app-container {
  @apply max-w-md mx-auto px-4;
}
```

### 2. Обновить Layout -- добавить единый контейнер
**Файл: `src/components/Layout.tsx`**

Обернуть все содержимое в общий контейнер с `max-w-md mx-auto px-4`, чтобы header, контент и навигация наследовали одну ширину:
```tsx
return (
  <div className="max-w-md mx-auto px-4 relative">
    {!user && <GuestBanner />}
    <TopHeader />
    <main className={`pb-28 ${mainPadding} transition-all duration-300`}>
      {children}
    </main>
    <BottomNavigation />
  </div>
);
```

### 3. Убрать дублирующие max-w-md из дочерних компонентов

**TopHeader** (строка 44): убрать `max-w-md mx-auto px-4` из внутреннего div, оставив только `pt-4`. Позиционирование `fixed` заменить на `sticky` или использовать контейнер иначе.

Но есть нюанс: `fixed`-элементы (header, banner, bottom nav) выходят из потока документа и не наследуют ширину родителя. Поэтому подход будет такой:

### Скорректированное решение

Поскольку header, banner и bottom nav используют `position: fixed`, они не могут наследовать ширину от родительского контейнера напрямую. Вместо этого:

**a) TopHeader (`src/components/TopHeader.tsx`, строка 44)**
Уже использует `max-w-md mx-auto px-4` -- корректно.

**b) GuestBanner (`src/components/GuestBanner.tsx`, строка 36)**
Уже исправлен на `max-w-md` -- корректно.

**c) BottomNavigation (`src/components/BottomNavigation.tsx`, строка 54)**
Заменить `max-w-2xl` на `max-w-md`, чтобы нижняя навигация совпадала по ширине с header.

**d) Страницы контента**
Все страницы, которые используют `max-w-md mx-auto px-4` внутри себя, уже корректны. Но чтобы централизовать это правило, оберну `children` в Layout в контейнер `max-w-md mx-auto px-4`, и постепенно уберу дублирование со страниц (это можно сделать потом).

### Итого -- минимальные изменения

| Файл | Изменение |
|------|-----------|
| `src/components/BottomNavigation.tsx` (строка 54) | `max-w-2xl` -> `max-w-md` |
| `src/components/Layout.tsx` (строка 36) | Обернуть `{children}` в `<div className="max-w-md mx-auto px-4">` |

Это обеспечит единую ширину для всех трех фиксированных элементов (banner, header, bottom nav) и контента страниц.
