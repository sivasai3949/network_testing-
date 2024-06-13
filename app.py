from flask import Flask, render_template, request
from dotenv import load_dotenv
import os
import requests

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Access the Replicate API token from environment variables
replicate_api = os.getenv('REPLICATE_API_TOKEN')

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    initial_message = "Hi there How can I assist you today?"
    messages = [{"role": "assistant", "content": initial_message}]

    if request.method == 'POST':
        user_input = request.form['user_input']
        messages.append({"role": "user", "content": user_input})

        # Call Replicate API to generate response
        response = generate_llama2_response(user_input)
        messages.append({"role": "assistant", "content": response})

    return render_template('chat.html', messages=messages)

def generate_llama2_response(prompt_input):
    # Example logic to call Replicate API using the token
    headers = {
        'Authorization': f'Bearer {replicate_api}',
        'Content-Type': 'application/json'
    }
    # Example call using requests library
    response = requests.post('https://api.replicate.ai/v1/models/a16z-infra/llama7b-v2-chat/run',
                             headers=headers,
                             json={"prompt": prompt_input, "max_tokens": 100})
    return response.json().get('output', {}).get('text', '')

if __name__ == '__main__':
    app.run(debug=True)