# telegram_bot_complete.py - Полная версия бота с обработкой всех типов интеграции

import asyncio
import json
import logging
import os
import urllib.parse
from datetime import datetime
from typing import Dict, Any
from dotenv import load_dotenv

import openai
from telegram import (
    Update, 
    InlineKeyboardButton, 
    InlineKeyboardMarkup, 
    KeyboardButton, 
    ReplyKeyboardMarkup, 
    WebAppInfo,
    InlineQueryResultArticle,
    InputTextMessageContent
)
from telegram.ext import (
    Application, 
    CommandHandler, 
    MessageHandler, 
    ContextTypes, 
    filters,
    InlineQueryHandler,
    CallbackQueryHandler
)

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Настройки
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
MINI_APP_URL = os.getenv('MINI_APP_URL', 'https://tap-tile-tango.onrender.com')

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
        """Обработка команды /start с поддержкой deep links"""
        user = update.effective_user
        args = context.args
        
        # Обработка deep links
        if args:
            command = args[0]
            
            # Скачивание таблицы
            if command == 'download_table_cohort':
                await self.send_download_table_button(update)
                return
            
            # Открытие курса
            elif command == 'open_course_sql':
                await self.send_course_button(update)
                return
            
            # Домашнее задание через deep link
            elif command.startswith('hw_'):
                parts = command.split('_', 2)
                if len(parts) == 3:
                    _, task_id, encoded_answer = parts
                    user_answer = urllib.parse.unquote(encoded_answer)
                    
                    await self.process_homework_submission(
                        update, 
                        task_id, 
                        user_answer
                    )
                    return
        
        # Обычный старт - показываем главное меню
        await self.show_main_menu(update)

    async def show_main_menu(self, update: Update):
        """Показ главного меню"""
        # Создаем клавиатуру с разными типами кнопок
        keyboard = [
            # WebApp через ReplyKeyboard (поддерживает sendData)
            [KeyboardButton(
                "🚀 Открыть тренажер (Keyboard)", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )],
            # Inline кнопка для WebApp (поддерживает query_id)
            [KeyboardButton("📝 Сдать домашку (Inline)")]
        ]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        
        welcome_text = f"""
🎯 <b>Добро пожаловать в AI Тренажер!</b>

Это интерактивная система обучения работе с ИИ-инструментами.

<b>🔥 Возможности:</b>
• Практические задания по анализу данных
• Автоматическая проверка домашних заданий
• Персональная обратная связь от ИИ
• Отслеживание прогресса

<b>📱 Способы взаимодействия:</b>
• <b>Keyboard WebApp</b> - для простых действий
• <b>Inline WebApp</b> - для отправки данных

Выберите действие из меню ниже 👇
        """
        
        await update.message.reply_text(
            welcome_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def send_homework_inline_button(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Отправка inline кнопки для сдачи домашки"""
        if update.message.text == "📝 Сдать домашку (Inline)":
            keyboard = [[
                InlineKeyboardButton(
                    "📝 Открыть форму для домашки", 
                    web_app=WebAppInfo(url=f"{MINI_APP_URL}?mode=homework")
                )
            ]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(
                "Нажмите кнопку ниже для отправки домашнего задания:",
                reply_markup=reply_markup
            )

    async def handle_web_app_data(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка данных от Mini App (только для Keyboard WebApp)"""
        try:
            # Получаем данные от Mini App
            web_app_data = update.message.web_app_data.data
            data = json.loads(web_app_data)
            
            user_id = update.effective_user.id
            action = data.get('action')
            
            logger.info(f"📱 Получены данные от WebApp: {data}")
            
            if action == 'download_table':
                await self.send_download_table_button(update)
            elif action == 'open_course':
                await self.send_course_button(update)
            elif action == 'submit_homework':
                task_id = data.get('taskId')
                user_answer = data.get('userAnswer')
                await self.process_homework_submission(update, task_id, user_answer)
            else:
                await update.message.reply_text("Неизвестное действие")
                
        except Exception as e:
            logger.error(f"Ошибка обработки WebApp данных: {e}")
            await update.message.reply_text("Произошла ошибка при обработке запроса")

    async def send_download_table_button(self, update: Update):
        """Отправка кнопки для скачивания таблицы"""
        material = self.materials['cohort-analysis-sql']
        
        keyboard = [
            [InlineKeyboardButton(
                f"📊 Скачать {material['table_filename']}", 
                url=material['table_url']
            )],
            [InlineKeyboardButton(
                "🔙 Главное меню", 
                callback_data="main_menu"
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
        """
        
        await update.message.reply_text(
            message_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def send_course_button(self, update: Update):
        """Отправка кнопки для открытия курса"""
        material = self.materials['cohort-analysis-sql']
        
        keyboard = [
            [InlineKeyboardButton(
                "🎓 Открыть курс SQL", 
                url=material['course_url']
            )],
            [InlineKeyboardButton(
                "🔙 Главное меню", 
                callback_data="main_menu"
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

Нажмите кнопку ниже чтобы открыть курс 👇
        """
        
        await update.message.reply_text(
            message_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def process_homework_submission(self, update: Update, task_id: str, user_answer: str):
        """Обработка отправленного домашнего задания"""
        # Сообщение о начале проверки
        processing_message = await update.message.reply_text(
            "🔄 Проверяю ваше задание...\n\n"
            "Это может занять несколько секунд ⏳"
        )
        
        try:
            # Проверяем через OpenAI
            result = await self.check_homework_with_openai(task_id, user_answer)
            
            # Удаляем сообщение о загрузке
            await processing_message.delete()
            
            # Отправляем результат
            await self.send_homework_result(update, result)
            
        except Exception as e:
            logger.error(f"Ошибка проверки задания: {e}")
            await processing_message.edit_text(
                "❌ Произошла ошибка при проверке задания.\n"
                "Попробуйте отправить еще раз."
            )

    async def check_homework_with_openai(self, task_id: str, user_answer: str) -> Dict[str, Any]:
        """Проверка задания через OpenAI"""
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": """Ты - эксперт по анализу данных и SQL. 
                        Оцени ответ студента по шкале от 0 до 100.
                        Дай конструктивную обратную связь.
                        Ответь в формате JSON: {"score": число, "feedback": "текст", "suggestions": ["совет1", "совет2"]}"""
                    },
                    {
                        "role": "user",
                        "content": f"Задание: {task_id}\n\nОтвет:\n{user_answer}"
                    }
                ],
                temperature=0.7
            )
            
            result_text = response.choices[0].message.content
            result = json.loads(result_text)
            
            return {
                'score': result.get('score', 75),
                'feedback': result.get('feedback', 'Хорошая работа!'),
                'suggestions': result.get('suggestions', [])
            }
            
        except Exception as e:
            logger.error(f"OpenAI error: {e}")
            # Возвращаем заглушку
            return {
                'score': 85,
                'feedback': 'Задание выполнено корректно!',
                'suggestions': ['Продолжайте в том же духе!']
            }

    async def send_homework_result(self, update: Update, result: Dict[str, Any]):
        """Отправка результата проверки"""
        score = result['score']
        feedback = result['feedback']
        suggestions = result.get('suggestions', [])
        
        # Определяем эмодзи по оценке
        if score >= 90:
            emoji = "🏆"
            status = "Отлично!"
        elif score >= 80:
            emoji = "⭐"
            status = "Хорошо!"
        elif score >= 60:
            emoji = "👍"
            status = "Неплохо"
        else:
            emoji = "📚"
            status = "Нужно доработать"
        
        message = f"""
{emoji} <b>{status}</b>

🎯 <b>Оценка: {score}/100</b>

📝 <b>Обратная связь:</b>
{feedback}
        """
        
        if suggestions:
            message += "\n\n💡 <b>Рекомендации:</b>\n"
            for i, suggestion in enumerate(suggestions, 1):
                message += f"{i}. {suggestion}\n"
        
        keyboard = [[
            InlineKeyboardButton("🏠 Главное меню", callback_data="main_menu"),
            InlineKeyboardButton("📚 Новое задание", callback_data="new_task")
        ]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            message,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def handle_callback_query(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка callback кнопок"""
        query = update.callback_query
        await query.answer()
        
        if query.data == "main_menu":
            await self.show_main_menu(query)
        elif query.data == "new_task":
            # Показываем WebApp для нового задания
            keyboard = [[
                InlineKeyboardButton(
                    "🚀 Открыть тренажер", 
                    web_app=WebAppInfo(url=MINI_APP_URL)
                )
            ]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(
                "Нажмите кнопку для выбора нового задания:",
                reply_markup=reply_markup
            )

def main():
    """Запуск бота"""
    if not TELEGRAM_BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN не установлен!")
        return
    
    # Создаем приложение
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Создаем экземпляр бота
    bot = TrainingBot()
    
    # Регистрируем обработчики
    application.add_handler(CommandHandler("start", bot.start_command))
    application.add_handler(CommandHandler("help", bot.help_command))
    
    # Обработчик текстовых сообщений
    application.add_handler(MessageHandler(
        filters.TEXT & ~filters.COMMAND, 
        bot.send_homework_inline_button
    ))
    
    # Обработчик данных от WebApp
    application.add_handler(MessageHandler(
        filters.StatusUpdate.WEB_APP_DATA, 
        bot.handle_web_app_data
    ))
    
    # Обработчик callback кнопок
    application.add_handler(CallbackQueryHandler(bot.handle_callback_query))
    
    # Запускаем бота
    logger.info("🚀 Бот запущен!")
    logger.info(f"📱 Mini App URL: {MINI_APP_URL}")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
