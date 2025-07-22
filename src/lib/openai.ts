// src/lib/openai.ts

interface HomeworkSubmission {
  taskTitle: string;
  userAnswer: string;
  materials?: string[];
  timestamp: string;
}

interface OpenAIResponse {
  success: boolean;
  feedback: string;
  score: number; // 0-100
  suggestions?: string[];
  error?: string;
}

export class OpenAIService {
  private apiKey: string;
  private assistantId: string;

  constructor(apiKey?: string, assistantId?: string) {
    // В продакшене эти значения должны приходить с бэкенда
    this.apiKey = apiKey || '';
    this.assistantId = assistantId || '';
  }

  // Метод для проверки домашнего задания
  async checkHomework(submission: HomeworkSubmission): Promise<OpenAIResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API ключ не настроен');
      }

      const prompt = this.createPromptForTask(submission);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseOpenAIResponse(data.choices[0].message.content);

    } catch (error) {
      console.error('Error checking homework:', error);
      return {
        success: false,
        feedback: 'Произошла ошибка при проверке задания. Попробуйте позже.',
        score: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getSystemPrompt(): string {
    return `Ты - эксперт по анализу данных и SQL, который проверяет домашние задания студентов. 
    
    Твоя задача:
    1. Оценить правильность выполнения задания по шкале от 0 до 100
    2. Дать конструктивную обратную связь
    3. Предложить улучшения, если необходимо
    4. Ответить в формате JSON с полями: score, feedback, suggestions

    Критерии оценки:
    - Правильность SQL запроса (40%)  
    - Логика анализа (30%)
    - Оформление и структура ответа (20%)
    - Использование AI инструментов (GPT) (10%)

    Будь доброжелательным, но объективным в оценке.`;
  }

  private createPromptForTask(submission: HomeworkSubmission): string {
    return `
    ЗАДАНИЕ: ${submission.taskTitle}
    
    ОТВЕТ СТУДЕНТА:
    ${submission.userAnswer}
    
    ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ:
    ${submission.materials?.join('\n') || 'Не предоставлены'}
    
    ВРЕМЯ ВЫПОЛНЕНИЯ: ${submission.timestamp}
    
    Пожалуйста, проверь это задание и дай оценку в формате JSON:
    {
      "score": число от 0 до 100,
      "feedback": "подробная обратная связь",
      "suggestions": ["предложение1", "предложение2"]
    }`;
  }

  private parseOpenAIResponse(content: string): OpenAIResponse {
    try {
      // Пытаемся извлечь JSON из ответа
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          feedback: parsed.feedback || content,
          score: parsed.score || 0,
          suggestions: parsed.suggestions || [],
        };
      }

      // Если JSON не найден, возвращаем как текст
      return {
        success: true,
        feedback: content,
        score: this.extractScoreFromText(content),
      };

    } catch (error) {
      return {
        success: true,
        feedback: content,
        score: 0,
      };
    }
  }

  private extractScoreFromText(text: string): number {
    // Простая логика извлечения оценки из текста
    const scoreMatch = text.match(/(\d+)\/100|\b(\d+)\s*%|\b(\d+)\s*баллов?/i);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]);
      return Math.min(100, Math.max(0, score));
    }
    return 0;
  }

  // Метод для получения примерных промптов для GPT
  async getSamplePrompts(taskTitle: string): Promise<string[]> {
    const prompts = {
      'Когортный анализ и SQL': [
        'Помоги мне составить SQL-запрос для анализа когорт пользователей',
        'Как найти сумму транзакций для клиентов с LTV больше 5000 рублей?',
        'Создай запрос для группировки пользователей по месяцам регистрации',
      ],
      'Анализ данных': [
        'Проанализируй эту таблицу и найди основные тренды',
        'Помоги выявить аномалии в данных',
        'Составь отчет по ключевым метрикам',
      ],
    };

    return prompts[taskTitle as keyof typeof prompts] || [
      'Помоги мне проанализировать эти данные',
      'Какие выводы можно сделать из этой информации?',
      'Создай структурированный анализ по этой задаче',
    ];
  }
}

// Singleton instance
export const openAIService = new OpenAIService();
