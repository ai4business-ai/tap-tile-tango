

# Легенда цветов на радар-чарте

## Что добавляем
Две небольшие сноски-легенды в верхних углах карточки с радар-чартом:
- **Левый верхний угол**: фиолетовый кружок + текст "Прогресс"
- **Правый верхний угол**: оранжевый пунктирный кружок + текст "Цель"

Это поможет пользователю понять, что означают два слоя на радаре.

## Технические изменения

### `src/pages/Index.tsx`
Внутри `<CardContent>` радар-чарта, перед `<ResponsiveContainer>`, добавить div с двумя элементами легенды:

```tsx
<div className="flex items-center justify-between mb-2 px-1">
  <div className="flex items-center gap-1.5">
    <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
    <span className="text-xs text-muted-foreground">Прогресс</span>
  </div>
  <div className="flex items-center gap-1.5">
    <div className="w-3 h-3 rounded-full border-2 border-dashed border-[#F97316]" />
    <span className="text-xs text-muted-foreground">Цель</span>
  </div>
</div>
```

### `src/pages/MyProgress.tsx`
Та же легенда в аналогичном месте -- внутри `<CardContent>` радар-чарта, перед `<ResponsiveContainer>`.

## Итого: 2 файла, добавление одного блока в каждый

