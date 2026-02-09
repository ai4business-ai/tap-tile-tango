

# Минимальное значение прогресса вместо скрытия слоя

## Проблема
При `progress_percent = 0` Recharts рисует артефакт -- вертикальную линию из центра. Скрывать слой целиком не нужно -- лучше показать крошечное кольцо, визуально воспринимаемое как "ноль".

## Решение
В `radarData` заменить `value: 0` на `value: 1` (1% из 100) -- это создаст едва заметное фиолетовое кольцо у центра, без артефактов.

## Изменения

### `src/pages/Index.tsx`
В формировании `radarData` заменить:
```tsx
value: skill.progress_percent,
```
на:
```tsx
value: Math.max(skill.progress_percent, 1),
```

### `src/pages/MyProgress.tsx`
Та же правка в `radarData`:
```tsx
value: Math.max(skill.progress_percent, 1),
```

### `PolarGrid gridCount={3}`
Также добавляем `gridCount={3}` к `<PolarGrid>` в обоих файлах, чтобы сетка соответствовала трем уровням (Basic/Pro/AI-Native).

## Итого: 2 файла, по 2 строки в каждом

