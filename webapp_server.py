# webapp_server.py - Дополнительный сервер для обработки WebApp запросов

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import hashlib
import hmac
from urllib.parse import parse_qs
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для WebApp

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
BOT_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

def verify_telegram_web_app_data(init_data: str) -> bool:
    """Проверка подлинности данных от Telegram WebApp"""
    try:
        # Парсим init_data
        parsed_data = parse_qs(init_data)
        
        # Извлекаем hash
        received_hash = parsed_data.get('hash', [''])[0]
        
        # Создаем data-check-string
        data_check_arr = []
        for key, value in parsed_data.items():
            if key != 'hash':
                data_check_arr.append(f"{key}={value[0]}")
        
        data_check_arr.sort()
        data_check_string = '\n'.join(data_check_arr)
        
        # Вычисляем secret_key
        secret_key = hmac.new(
            "WebAppData".encode(), 
            TELEGRAM_BOT_TOKEN.encode(), 
            hashlib.sha256
        ).digest()
        
        # Вычисляем hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return calculated_hash == received_hash
    except Exception as e:
        print(f"Error verifying data: {e}")
        return False

@app.route('/api/submit-homework', methods=['POST'])
def submit_homework():
    """Endpoint для отправки домашнего задания"""
    try:
        data = request.json
        init_data = request.headers.get('X-Telegram-Init-Data', '')
        
        # Проверяем подлинность данных
        if not verify_telegram_web_app_data(init_data):
            return jsonify({'error': 'Invalid init data'}), 401
        
        # Парсим данные пользователя
        parsed_data = parse_qs(init_data)
        user_data = json.loads(parsed_data.get('user', ['{}'])[0])
        user_id = user_data.get('id')
        
        # Получаем данные задания
        task_id = data.get('taskId')
        user_answer = data.get('userAnswer')
        
        # Отправляем сообщение пользователю через бота
        message_text = f"""
📝 <b>Получено домашнее задание!</b>

<b>Задание:</b> {task_id}
<b>Ваш ответ:</b>
{user_answer[:500]}...

⏳ Проверка займет несколько секунд...
        """
        
        response = requests.post(
            f"{BOT_API_URL}/sendMessage",
            json={
                'chat_id': user_id,
                'text': message_text,
                'parse_mode': 'HTML'
            }
        )
        
        if response.status_code == 200:
            # Здесь можно добавить вызов OpenAI для проверки
            return jsonify({
                'success': True,
                'message': 'Задание отправлено на проверку'
            })
        else:
            return jsonify({
                'error': 'Failed to send message'
            }), 500
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/answer-webapp-query', methods=['POST'])
def answer_webapp_query():
    """Endpoint для ответа на WebApp query (для inline buttons)"""
    try:
        data = request.json
        query_id = data.get('queryId')
        result = data.get('result')
        
        # Используем answerWebAppQuery
        response = requests.post(
            f"{BOT_API_URL}/answerWebAppQuery",
            json={
                'web_app_query_id': query_id,
                'result': {
                    'type': 'article',
                    'id': '1',
                    'title': 'Домашнее задание отправлено',
                    'input_message_content': {
                        'message_text': result,
                        'parse_mode': 'HTML'
                    }
                }
            }
        )
        
        return jsonify({
            'success': response.status_code == 200
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Запускаем сервер
    app.run(host='0.0.0.0', port=5000, debug=True)
