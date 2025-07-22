# telegram_bot.py
import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Dict, Any

import openai
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Настройки
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'YOUR_OPENAI_API_KEY')
MINI_APP_URL = os.getenv('MINI_APP_URL', 'https://your-mini-app-url.com')

# Инициализация OpenAI
openai.api_key = OPENAI_API_KEY

class TrainingBot:
    def __init__(self):
        self.user_sessions: Dict[int, Dict[str, Any]] = {}
        
        # Материалы для заданий
        self.materials = {
            'cohort-analysis-sql': {
                'table_url': 'https://docs.google.com/spreadsheets/d/1example123/export?format=xlsx',
                'table_filename': 'cohort_analysis_data.xlsx',
                'course_url': 'https://sqlcourse.example.com/cohort-analysis',
                'description': 'Таблица с данными для когортного анализа'
            }
        }

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка команды /start"""
        user = update.effective_user
        
        # Создаем клавиатуру с кнопкой для запуска Mini App
        keyboard = [
            [KeyboardButton(
                "🚀 Открыть тренажер", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]
        ]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        
        welcome_text = f"""
🎯 Добро пожаловать в AI Тренажер, {user.first_name}!

Это интерактивная система обучения работе с ИИ-инструментами.

🔥 Возможности:
• Практические задания по анализу данных
• Автоматическая проверка домашних заданий
• Персональная обратная связь от ИИ
• Отслеживание прогресса

Нажмите "🚀 Открыть тренажер" чтобы начать!
        """
        
        await update.message.reply_text(
            welcome_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка команды /help"""
        help_text = """
📖 <b>Помощь по AI Тренажеру</b>

<b>Команды:</b>
/start - Начать работу с тренажером
/help - Показать эту справку

<b>Как пользоваться:</b>
1. Откройте тренажер через кнопку
2. Выберите задание для выполнения
3. Изучите материалы и выполните задачу
4. Отправьте решение на проверку

<b>Возможности:</b>
• 🎯 Интерактивные задания
• 📊 Анализ данных с ИИ
• 🤖 Автоматическая проверка
• 📈 Отслеживание прогресса

Если возникли вопросы, обратитесь к администратору.
        """
        
        await update.message.reply_text(help_text, parse_mode='HTML')

    async def handle_web_app_data(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка данных от Mini App"""
        try:
            # Получаем данные от Mini App
            web_app_data = update.message.web_app_data.data
            data = json.loads(web_app_data)
            
            user_id = update.effective_user.id
            action = data.get('action')
            
            logger.info(f"Получены данные от Mini App: {data}")
            
            if action == 'download_table':
                await self.handle_download_table(update, data)
            elif action == 'open_course':
                await self.handle_open_course(update, data)
            elif action == 'submit_homework':
                await self.handle_submit_homework(update, data)
            else:
                await update.message.reply_text("Неизвестное действие от Mini App")
                
        except Exception as e:
            logger.error(f"Ошибка обработки данных Mini App: {e}")
            await update.message.reply_text("Произошла ошибка при обработке запроса")

    async def handle_download_table(self, update: Update, data: Dict[str, Any]):
        """Отправка кнопки для скачивания таблицы"""
        task_id = data.get('taskId', 'cohort-analysis-sql')
        material = self.materials.get(task_id, {})
        
        if not material:
            await update.message.reply_text("Материалы для этого задания не найдены")
            return
        
        # Создаем клавиатуру с кнопкой скачивания
        keyboard = [
            [InlineKeyboardButton(
                f"📊 Скачать {material['table_filename']}", 
                url=material['table_url']
            )],
            [InlineKeyboardButton(
                "🔙 Назад в тренажер", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        message_text = f"""
📊 <b>Материалы для задания готовы!</b>

<b>Описание:</b> {material['description']}

<b>Инструкция:</b>
1. Нажмите кнопку "Скачать" ниже
2. Откройте файл в Excel или Google Sheets  
3. Изучите структуру данных
4. Вернитесь в тренажер для выполнения задания

⚠️ <i>Файл содержит данные для когортного анализа с информацией о клиентах и транзакциях</i>
        """
        
        await update.message.reply_text(
            message_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def handle_open_course(self, update: Update, data: Dict[str, Any]):
        """Отправка ссылки на курс"""
        task_id = data.get('taskId', 'cohort-analysis-sql')
        material = self.materials.get(task_id, {})
        
        if not material:
            await update.message.reply_text("Материалы для этого задания не найдены")
            return
        
        keyboard = [
            [InlineKeyboardButton(
                "🎓 Открыть курс SQL", 
                url=material['course_url']
            )],
            [InlineKeyboardButton(
                "🔙 Назад в тренажер", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        message_text = """
🎓 <b>Обучающий курс готов!</b>

<b>Курс включает:</b>
• Основы SQL запросов
• Работа с агрегатными функциями  
• Когортный анализ на практике
• Примеры использования GPT для SQL

<b>Рекомендуется:</b>
Пройти курс перед выполнением задания для лучшего понимания материала.

Нажмите кнопку ниже чтобы открыть курс 👇
        """
        
        await update.message.reply_text(
            message_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def handle_submit_homework(self, update: Update, data: Dict[str, Any]):
        """Обработка отправки домашнего задания"""
        user_id = update.effective_user.id
        task_id = data.get('taskId', '')
        user_answer = data.get('userAnswer', '')
        
        if not user_answer.strip():
            await update.message.reply_text("Ответ не может быть пустым!")
            return
        
        # Сообщение о начале проверки
        processing_message = await update.message.reply_text(
            "🔄 Проверяю ваше задание...\n\n"
            "Это может занять несколько секунд ⏳"
        )
        
        try:
            # Проверяем задание через OpenAI
            result = await self.check_homework_with_ai(task_id, user_answer)
            
            # Удаляем сообщение о загрузке
            await processing_message.delete()
            
            # Формируем результат
            await self.send_homework_result(update, result)
            
        except Exception as e:
            logger.error(f"Ошибка проверки задания: {e}")
            await processing_message.edit_text(
                "❌ Произошла ошибка при проверке задания.\n"
                "Попробуйте отправить еще раз или обратитесь к администратору."
            )

    async def check_homework_with_ai(self, task_id: str, user_answer: str) -> Dict[str, Any]:
        """Проверка домашнего задания через OpenAI"""
        
        system_prompt = """
Ты - опытный эксперт по анализу данных и SQL, который проверяет домашние задания студентов.

Твоя задача:
1. Оценить правильность выполнения задания по шкале от 0 до 100
2. Дать конструктивную обратную связь на русском языке
3. Предложить конкретные улучшения

Критерии оценки:
- Правильность SQL запроса (40%)
- Логика анализа данных (30%) 
- Структура и оформление ответа (20%)
- Использование AI инструментов (10%)

Ответ должен быть в формате JSON:
{
    "score": число от 0 до 100,
    "feedback": "подробная обратная связь на русском языке",
    "suggestions": ["конкретное предложение 1", "предложение 2"]
}
        """
        
        user_prompt = f"""
ЗАДАНИЕ: Когортный анализ и SQL
Составить SQL запрос для выявления суммы всех транзакций у клиентов, чьё LTV больше 5000 рублей

ОТВЕТ СТУДЕНТА:
{user_answer}

ВРЕМЯ ВЫПОЛНЕНИЯ: {datetime.now().isoformat()}

Пожалуйста, проверь это задание согласно критериям.
        """
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            
            # Парсим JSON ответ
            try:
                result = json.loads(content)
                return result
            except json.JSONDecodeError:
                # Если не JSON, создаем структурированный ответ
                return {
                    "score": 75,  # средняя оценка по умолчанию
                    "feedback": content,
                    "suggestions": ["Обратитесь к преподавателю за дополнительными разъяснениями"]
                }
                
        except Exception as e:
            logger.error(f"Ошибка OpenAI API: {e}")
            return {
                "score": 0,
                "feedback": "Не удалось проверить задание автоматически. Обратитесь к преподавателю.",
                "suggestions": ["Проверьте подключение к интернету и попробуйте еще раз"]
            }

    async def send_homework_result(self, update: Update, result: Dict[str, Any]):
        """Отправка результатов проверки"""
        score = result.get('score', 0)
        feedback = result.get('feedback', 'Обратная связь недоступна')
        suggestions = result.get('suggestions', [])
        
        # Определяем эмодзи и статус на основе оценки
        if score >= 90:
            emoji = "🏆"
            status = "Отлично!"
            color = "🟢"
        elif score >= 80:
            emoji = "⭐"
            status = "Хорошо!"
            color = "🟡"  
        elif score >= 60:
            emoji = "👍"
            status = "Удовлетворительно"
            color = "🟠"
        else:
            emoji = "📚"
            status = "Требуется доработка"
            color = "🔴"
        
        message_text = f"""
{emoji} <b>{status}</b>

{color} <b>Оценка: {score}/100</b>

<b>📝 Обратная связь:</b>
{feedback}
        """
        
        if suggestions:
            message_text += "\n\n<b>💡 Рекомендации:</b>\n"
            for i, suggestion in enumerate(suggestions, 1):
                message_text += f"{i}. {suggestion}\n"
        
        # Кнопки для дальнейших действий
        keyboard = []
        
        if score < 80:
            keyboard.append([InlineKeyboardButton(
                "🔄 Попробовать еще раз", 
                web_app=WebAppInfo(url=f"{MINI_APP_URL}/task-detail")
            )])
        
        keyboard.append([InlineKeyboardButton(
            "🏠 Вернуться в тренажер", 
            web_app=WebAppInfo(url=MINI_APP_URL)
        )])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            message_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка обычных сообщений"""
        text = update.message.text
        
        if text == "🚀 Открыть тренажер":
            keyboard = [[InlineKeyboardButton(
                "🎯 Запустить AI Тренажер", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(
                "🎯 Готов к запуску AI Тренажера!\n\n"
                "Нажмите кнопку ниже для начала обучения:",
                reply_markup=reply_markup
            )
        else:
            await update.message.reply_text(
                "Используйте кнопку '🚀 Открыть тренажер' или команды /start и /help"
            )

def main():
    """Запуск бота"""
    bot = TrainingBot()
    
    # Создаем приложение
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Добавляем обработчики
    application.add_handler(CommandHandler("start", bot.start_command))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, bot.handle_web_app_data))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    # Запускаем бота
    logger.info("Запуск AI Тренажера...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
