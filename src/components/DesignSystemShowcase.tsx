import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Check } from 'lucide-react';

/**
 * Design System Showcase Component
 * 
 * Демонстрирует все компоненты дизайн-системы для референса.
 * Используйте эту страницу как справочник по стилям.
 */
export const DesignSystemShowcase = () => {
  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-deep-purple mb-2">Design System</h1>
      <p className="text-muted-foreground mb-8">Glass Liquid Design - Светлая тема</p>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Цвета</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-3xl">
            <div className="w-full h-20 rounded-2xl bg-primary-orange mb-2"></div>
            <p className="text-sm font-medium">Primary Orange</p>
            <p className="text-xs text-muted-foreground">#F3AE5C</p>
          </div>
          <div className="glass-card p-4 rounded-3xl">
            <div className="w-full h-20 rounded-2xl bg-deep-purple mb-2"></div>
            <p className="text-sm font-medium">Deep Purple</p>
            <p className="text-xs text-muted-foreground">#610658</p>
          </div>
          <div className="glass-card p-4 rounded-3xl">
            <div className="w-full h-20 rounded-2xl bg-sky-blue mb-2"></div>
            <p className="text-sm font-medium">Sky Blue</p>
            <p className="text-xs text-muted-foreground">#08ADFD</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Кнопки</h2>
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Heart className="w-5 h-5" /></Button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Карточки</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a standard card with glass morphism effect.
              </p>
            </CardContent>
          </Card>
          
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-deep-purple mb-2">Glass Card</h3>
            <p className="text-sm text-muted-foreground">
              Custom glass card with backdrop blur and transparency.
            </p>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Бейджи</h2>
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="default"><Star className="w-3 h-3 mr-1" />Featured</Badge>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Прогресс бары</h2>
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">25%</p>
            <Progress value={25} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">50%</p>
            <Progress value={50} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">75%</p>
            <Progress value={75} />
          </div>
        </div>
      </section>

      {/* Glass Effects */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Glass эффекты</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-semibold mb-2">Glass</h3>
            <p className="text-sm text-muted-foreground">Standard glass effect with 70% opacity</p>
          </div>
          <div className="glass-subtle p-6 rounded-3xl">
            <h3 className="font-semibold mb-2">Glass Subtle</h3>
            <p className="text-sm text-muted-foreground">Subtle glass with 60% opacity</p>
          </div>
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="font-semibold mb-2">Glass Card</h3>
            <p className="text-sm text-muted-foreground">Card glass with 85% opacity</p>
          </div>
          <div className="glass-strong p-6 rounded-3xl">
            <h3 className="font-semibold mb-2">Glass Strong</h3>
            <p className="text-sm text-muted-foreground">Strong glass with 95% opacity</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Типографика</h2>
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-deep-purple">Heading 1</h1>
            <p className="text-xs text-muted-foreground">4xl / Bold</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-deep-purple">Heading 2</h2>
            <p className="text-xs text-muted-foreground">3xl / Bold</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-deep-purple">Heading 3</h3>
            <p className="text-xs text-muted-foreground">2xl / Semibold</p>
          </div>
          <div>
            <p className="text-base">Body text - Regular paragraph with standard sizing</p>
            <p className="text-xs text-muted-foreground">base / Regular</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Small text - Used for captions and secondary information</p>
            <p className="text-xs text-muted-foreground">sm / Regular</p>
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-deep-purple mb-4">Градиенты</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 rounded-3xl bg-gradient-primary flex items-center justify-center">
            <p className="text-white font-semibold">Primary Gradient</p>
          </div>
          <div className="h-32 rounded-3xl bg-gradient-purple-blue flex items-center justify-center">
            <p className="text-white font-semibold">Purple-Blue Gradient</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemShowcase;
