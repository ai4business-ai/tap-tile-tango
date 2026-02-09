
# План: Исправление двух проблем

## 1. Google OAuth не работает

**Диагностика**: В логах Supabase Auth нет записей о попытках входа через Google. Код на стороне приложения корректный — используется стандартный `supabase.auth.signInWithOAuth`. Проблема почти наверняка в настройках Supabase Dashboard.

**Что нужно сделать (вручную в Supabase Dashboard)**:
1. Перейти в [Authentication > Providers](https://supabase.com/dashboard/project/nhxrajtfxavkkzqyfrok/auth/providers)
2. Убедиться, что Google провайдер **включен**
3. Проверить что заполнены **Client ID** и **Client Secret** из Google Cloud Console
4. В [Authentication > URL Configuration](https://supabase.com/dashboard/project/nhxrajtfxavkkzqyfrok/auth/url-configuration):
   - **Site URL**: `https://ai-training-beeline.lovable.app`
   - **Redirect URLs** должны включать:
     - `https://ai-training-beeline.lovable.app/`
     - `https://id-preview--701aba60-14f7-47f3-a617-f335e9e3619c.lovable.app/`
5. В Google Cloud Console > OAuth Client:
   - **Authorized JavaScript origins**: добавить оба URL приложения
   - **Authorized redirect URIs**: добавить `https://nhxrajtfxavkkzqyfrok.supabase.co/auth/v1/callback`

Со стороны кода изменения не требуются — реализация корректная.

## 2. Header закрывает название задания

**Проблема**: Фиксированный TopHeader (glass-header) перекрывает верхнюю часть контента на страницах заданий. Текущий отступ `pt-28` (112px) недостаточен для высоты header + закругления.

**Решение**: Увеличить верхний padding в Layout с `pt-28` до `pt-32` (128px), а при наличии баннера — с `pt-36` до `pt-40`.

### Изменения в коде

**Файл: `src/components/Layout.tsx`** (строка 30):
```tsx
// Было:
const mainPadding = showBanner ? 'pt-36' : 'pt-28';

// Станет:
const mainPadding = showBanner ? 'pt-40' : 'pt-32';
```

Это одно минимальное изменение решит проблему перекрытия для всех страниц, включая страницы заданий.
