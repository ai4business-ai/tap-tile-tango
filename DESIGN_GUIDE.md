# Design System Guide

## Overview
Glass Liquid Design с светлой темой. Мобильная верстка.

## Color Palette

### Primary Colors (HSL)
- **Primary Orange**: `32 86% 66%` (#F3AE5C) - основной акцент, кнопки, важные элементы
- **Deep Purple**: `303 89% 19%` (#610658) - вторичный цвет, заголовки, темный текст
- **Sky Blue**: `199 98% 51%` (#08ADFD) - акцентный цвет, ссылки, прогресс

### Neutrals (HSL)
- **Background**: `210 40% 98%` - светлый основной фон
- **Foreground**: `303 89% 19%` - темный текст (deep purple)
- **Card**: `0 0% 100%` - белый с прозрачностью для glass эффекта
- **Muted**: `220 14% 96%` - приглушенные элементы
- **Border**: `220 13% 91%` - границы

### Gradients
- **Background**: `linear-gradient(135deg, #FFF5EB 0%, #E8F4FD 50%, #F0E6F6 100%)`
- **Primary**: `linear-gradient(135deg, #F3AE5C 0%, #08ADFD 100%)`
- **Purple-Blue**: `linear-gradient(135deg, #610658 0%, #08ADFD 100%)`

## Typography

### Font Family
- **Primary**: `Inter, system-ui, -apple-system, sans-serif`
- **Fallback**: `sans-serif`

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)

### Font Weights
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

## Glass Liquid Design Principles

### Glass Effects
1. **Transparency**: 60-95% непрозрачность фона
2. **Blur**: `backdrop-filter: blur(12-28px)`
3. **Borders**: 1px solid с `rgba(255, 255, 255, 0.3-0.6)`
4. **Shadows**: мягкие тени с низким spread
5. **Gradients**: градиенты на фонах и элементах

### Border Radius
- **Small**: 12px - badges, chips
- **Medium**: 16px - buttons, inputs
- **Large**: 24px - cards
- **XL**: 32px - модальные окна

### Shadows
- **Subtle**: `0 2px 8px rgba(0, 0, 0, 0.05)`
- **Medium**: `0 4px 16px rgba(0, 0, 0, 0.08)`
- **Strong**: `0 8px 32px rgba(0, 0, 0, 0.12)`
- **Glow Orange**: `0 4px 24px rgba(243, 174, 92, 0.3)`
- **Glow Blue**: `0 4px 24px rgba(8, 173, 253, 0.3)`

## Components

### Buttons
- **Default (Primary)**: оранжевый фон, белый текст, hover: светлее
- **Secondary**: фиолетовый фон, белый текст
- **Outline**: прозрачный с border, glass эффект
- **Ghost**: прозрачный, hover: glass эффект
- **Border Radius**: 16px
- **Padding**: `12px 24px` (medium), `16px 32px` (large)

### Cards
- **Background**: белый с 85-95% непрозрачности
- **Border**: 1px solid `rgba(255, 255, 255, 0.5)`
- **Border Radius**: 24px
- **Blur**: 24px
- **Shadow**: medium или strong
- **Padding**: 24px

### Badges
- **Shape**: pill (fully rounded)
- **Sizes**: small (px-3 py-1), medium (px-4 py-1.5)
- **Colors**: используют primary colors с прозрачностью

### Progress Bars
- **Height**: 8px
- **Border Radius**: 12px (fully rounded)
- **Background**: muted color
- **Fill**: градиент от sky-blue к primary-orange

### Icons
- **Size**: 20px (small), 24px (medium), 32px (large)
- **Stroke Width**: 2px
- **Color**: inherit от parent или semantic colors

## Spacing System
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## Animations & Transitions
- **Duration**: 200-300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- **Hover Scale**: `scale(1.02)` для карточек
- **Tap Scale**: `scale(0.98)` для кнопок

## Mobile-First Design
- **Base**: 320px - 640px (mobile)
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

### Mobile Guidelines
- Минимальный touch target: 44x44px
- Padding: 16px по бокам
- Stack layout (vertical) для карточек
- Большие кнопки (min-height: 48px)
- Крупный текст (min 16px для body)

## Usage Examples

### Glass Card
```tsx
<div className="glass-card rounded-3xl p-6 shadow-lg">
  <h3 className="text-2xl font-semibold text-deep-purple">Title</h3>
  <p className="text-muted-foreground">Content</p>
</div>
```

### Primary Button
```tsx
<Button className="bg-primary-orange hover:bg-primary-orange/90">
  Click Me
</Button>
```

### Badge
```tsx
<Badge className="bg-sky-blue/20 text-sky-blue border-sky-blue/30">
  New
</Badge>
```

## Accessibility
- Контрастность текста: минимум 4.5:1 для body, 3:1 для заголовков
- Focus states: видимый outline
- Touch targets: минимум 44x44px
- Alt text для всех изображений
