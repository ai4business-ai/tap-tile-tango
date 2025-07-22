# telegram_bot.py - Рабочий бот с KeyboardButton для WebApp
import os
import sys
import json
import logging
import asyncio
from datetime import datetime
from typing import Dict, Any

from telegram import (
    Update, 
    KeyboardButton, 
    ReplyKeyboardMarkup, 
    WebAppInfo,
    InlineKeyboardButton,
    InlineKeyboardMarkup
)
from telegram.ext import (
    Application, 
    CommandHandler, 
    MessageHandler, 
    ContextTypes, 
    filters,
    CallbackQueryHandler
)

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Конфигурация из переменных окружения
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
MINI_APP_URL = os.environ.get('MINI_APP_URL', 'https://tap-tile-tango.onrender.com')

if not TELEGRAM_BOT_TOKEN:
    logger.error("❌ TELEGRAM_BOT_TOKEN не установлен!")
    sys.exit(1)

logger.info(f"✅ Бот инициализирован")
logger.info(f"📱 Mini App URL: {MINI_APP_URL}")

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
        
        # ВАЖНО: Используем KeyboardButton для поддержки sendData
        keyboard = [
            # Основная кнопка для открытия WebApp
            [KeyboardButton(
                "🚀 Открыть тренажер", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )],
            # Дополнительные кнопки для быстрого доступа
            [
                KeyboardButton("📊 Мои результаты"),
                KeyboardButton("❓ Помощь")
            ]
        ]
        
        reply_markup = ReplyKeyboardMarkup(
            keyboard, 
            resize_keyboard=True,
            input_field_placeholder="Выберите действие..."
        )
        
        welcome_text = f"""
🎯 <b>Добро пожаловать в AI Тренажер, {user.first_name}!</b>

Это интерактивная система обучения работе с ИИ-инструментами.

<b>🔥 Возможности:</b>
• Практические задания по анализу данных
• Автоматическая проверка домашних заданий  
• Персональная обратная связь от ИИ
• Отслеживание прогресса

<b>📱 Как начать:</b>
Нажмите кнопку <b>"🚀 Открыть тренажер"</b> внизу экрана.

<i>💡 Подсказка: WebApp откроется прямо в Telegram!</i>
        """
        
        await update.message.reply_text(
            welcome_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def handle_web_app_data(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка данных от WebApp через sendData"""
        try:
            # Получаем данные от WebApp
            web_app_data = update.message.web_app_data.data
            data = json.loads(web_app_data)
            
            user_id = update.effective_user.id
            action = data.get('action')
            
            logger.info(f"📱 Получены данные от WebApp:")
            logger.info(f"   Пользователь: {user_id}")
            logger.info(f"   Действие: {action}")
            logger.info(f"   Данные: {json.dumps(data, ensure_ascii=False)}")
            
            # Обработка различных действий
            if action == 'test':
                await self.handle_test_action(update, data)
            elif action == 'download_table':
                await self.handle_download_table(update, data)
            elif action == 'open_course':
                await self.handle_open_course(update, data)
            elif action == 'submit_homework':
                await self.handle_submit_homework(update, data)
            else:
                logger.warning(f"Неизвестное действие: {action}")
                await update.message.reply_text(
                    f"Получено неизвестное действие: {action}"
                )
                
        except json.JSONDecodeError as e:
            logger.error(f"Ошибка парсинга JSON: {e}")
            await update.message.reply_text(
                "❌ Ошибка обработки данных от приложения"
            )
        except Exception as e:
            logger.error(f"Ошибка обработки WebApp данных: {e}")
            await update.message.reply_text(
                "❌ Произошла ошибка при обработке запроса"
            )

    async def handle_test_action(self, update: Update, data: Dict[str, Any]):
        """Обработка тестового действия"""
        await update.message.reply_text(
            f"✅ <b>Тестовое сообщение получено!</b>\n\n"
            f"Данные: <code>{json.dumps(data, indent=2, ensure_ascii=False)}</code>",
            parse_mode='HTML'
        )

    async def handle_download_table(self, update: Update, data: Dict[str, Any]):
        """Отправка ссылки на скачивание таблицы"""
        task_id = data.get('taskId', 'cohort-analysis-sql')
        material = self.materials.get(task_id, {})
        
        if not material:
            await update.message.reply_text("❌ Материалы не найдены")
            return
        
        keyboard = [
            [InlineKeyboardButton(
                f"📊 Скачать {material['table_filename']}", 
                url=material['table_url']
            )],
            [InlineKeyboardButton(
                "🔙 Вернуться в тренажер", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        message_text = f"""
📊 <b>Материалы для задания готовы!</b>

<b>Файл:</b> {material['table_filename']}
<b>Описание:</b> {material['description']}

<b>Инструкция:</b>
1. Нажмите кнопку "Скачать" ниже
2. Откройте файл в Excel или Google Sheets  
3. Изучите структуру данных
4. Вернитесь в тренажер для выполнения задания

<i>💡 Совет: Обратите внимание на столбцы с датами и суммами транзакций</i>
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
        
        keyboard = [
            [InlineKeyboardButton(
                "🎓 Открыть курс SQL", 
                url=material.get('course_url', '#')
            )],
            [InlineKeyboardButton(
                "🔙 Вернуться в тренажер", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            """
🎓 <b>Обучающий курс готов!</b>

<b>В курсе вы изучите:</b>
• Основы SQL запросов
• Работа с агрегатными функциями  
• Когортный анализ на практике
• Использование GPT для генерации SQL

<b>Длительность:</b> ~30 минут

Нажмите кнопку ниже для начала обучения 👇
            """,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def handle_submit_homework(self, update: Update, data: Dict[str, Any]):
        """Обработка отправленного домашнего задания"""
        user_id = update.effective_user.id
        task_id = data.get('taskId', '')
        user_answer = data.get('userAnswer', '')
        
        logger.info(f"📝 Получено домашнее задание от пользователя {user_id}")
        
        # Отправляем подтверждение получения
        processing_msg = await update.message.reply_text(
            "🔄 <b>Проверяю ваше задание...</b>\n\n"
            "Это займет несколько секунд ⏳",
            parse_mode='HTML'
        )
        
        # Имитация проверки (в реальном проекте здесь вызов OpenAI)
        await asyncio.sleep(2)
        
        # Удаляем сообщение о загрузке
        await processing_msg.delete()
        
        # Отправляем результат
        await self.send_homework_result(update, user_answer)

    async def send_homework_result(self, update: Update, user_answer: str):
        """Отправка результата проверки задания"""
        # Имитация результата проверки
        score = 85
        
        result_text = f"""
🎉 <b>Задание проверено!</b>

🎯 <b>Оценка: {score}/100</b>

<b>📝 Ваш ответ:</b>
<i>{user_answer[:200]}...</i>

<b>✅ Обратная связь:</b>
Отличная работа! Вы правильно определили основные метрики для когортного анализа. 

<b>💡 Рекомендации:</b>
• Добавьте анализ Retention Rate по месяцам
• Используйте визуализацию для наглядности
• Попробуйте сегментировать клиентов по LTV

<b>🏆 Достижение разблокировано:</b>
"Первое задание" - вы успешно сдали свою первую домашнюю работу!
        """
        
        keyboard = [
            [
                InlineKeyboardButton("📊 Следующее задание", callback_data="next_task"),
                InlineKeyboardButton("🔄 Попробовать снова", callback_data="retry")
            ],
            [InlineKeyboardButton(
                "🏠 В главное меню", 
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            result_text,
            reply_markup=reply_markup,
            parse_mode='HTML'
        )

    async def handle_text_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка обычных текстовых сообщений"""
        text = update.message.text
        
        if text == "📊 Мои результаты":
            await update.message.reply_text(
                "📊 <b>Ваша статистика:</b>\n\n"
                "Выполнено заданий: 0\n"
                "Средний балл: -\n"
                "Лучший результат: -\n\n"
                "Начните с первого задания в тренажере!",
                parse_mode='HTML'
            )
        elif text == "❓ Помощь":
            await self.help_command(update, context)
        else:
            await update.message.reply_text(
                "Используйте кнопки меню для навигации или нажмите /help для справки"
            )

    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Команда помощи"""
        help_text = """
❓ <b>Помощь по AI Тренажеру</b>

<b>Основные команды:</b>
/start - Главное меню
/help - Эта справка

<b>Как пользоваться:</b>
1. Нажмите "🚀 Открыть тренажер"
2. Выберите задание
3. Изучите материалы
4. Выполните задание
5. Нажмите "Сдать домашку"

<b>Важно:</b>
• Приложение работает прямо в Telegram
• Все данные сохраняются автоматически
• Можно вернуться к заданию в любой момент

<b>Проблемы?</b>
Напишите @your_support_bot
        """
        
        await update.message.reply_text(help_text, parse_mode='HTML')

    async def handle_callback_query(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработка inline кнопок"""
        query = update.callback_query
        await query.answer()
        
        if query.data == "next_task":
            await query.edit_message_text(
                "🚀 Следующее задание будет доступно скоро!",
                reply_markup=None
            )
        elif query.data == "retry":
            keyboard = [[InlineKeyboardButton(
                "🔄 Открыть задание", 
                web_app=WebAppInfo(url=f"{MINI_APP_URL}/tasks/data-analysis/cohort-analysis-sql")
            )]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(
                "Попробуйте выполнить задание еще раз!",
                reply_markup=reply_markup
            )

def main():
    """Запуск бота"""
    # Создаем приложение
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Создаем экземпляр бота
    bot = TrainingBot()
    
    # Регистрируем обработчики
    application.add_handler(CommandHandler("start", bot.start_command))
    application.add_handler(CommandHandler("help", bot.help_command))
    
    # КРИТИЧЕСКИ ВАЖНО: Обработчик данных от WebApp
    application.add_handler(MessageHandler(
        filters.StatusUpdate.WEB_APP_DATA, 
        bot.handle_web_app_data
    ))
    
    # Обработчик обычных текстовых сообщений
    application.add_handler(MessageHandler(
        filters.TEXT & ~filters.COMMAND, 
        bot.handle_text_message
    ))
    
    # Обработчик callback кнопок
    application.add_handler(CallbackQueryHandler(bot.handle_callback_query))
    
    # Запускаем бота
    logger.info("🚀 Бот запущен и готов к работе!")
    logger.info("📱 Ожидаем данные от WebApp через KeyboardButton")
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
