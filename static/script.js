document.getElementById('send-btn').addEventListener('click', function(event) {
    event.preventDefault();
    sendUserInput();
});

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendUserInput();
    }
});

function sendUserInput() {
    var userInput = document.getElementById('user-input').value;
    fetch('/process_chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'user_input=' + encodeURIComponent(userInput)
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes('<ul')) {
            appendChat("user", userInput);
            displayOptions(data);
        } else {
            appendChat("user", userInput);
            appendChat("robot", data);
        }
    })
    .catch(error => console.error('Error:', error));
}

function appendChat(role, message) {
    var chatContainer = document.getElementById('chat-container');
    var chatBubble = document.createElement('div');
    chatBubble.classList.add('chat-bubble');
    chatBubble.classList.add(role);
    chatBubble.innerText = message;
    chatContainer.appendChild(chatBubble);
    document.getElementById('user-input').value = ''; // Clear input field after sending
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom of chat
}

function displayOptions(optionsHtml) {
    var chatContainer = document.getElementById('chat-container');
    var optionsContainer = document.createElement('div');
    optionsContainer.classList.add('chat-bubble', 'robot');
    optionsContainer.innerHTML = optionsHtml;
    chatContainer.appendChild(optionsContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom of chat

    // Add event listeners for options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            sendOption(option.textContent);
        });
    });
}

function sendOption(option) {
    appendChat("user", option);
    fetch('/process_chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'user_input=' + encodeURIComponent(option)
    })
    .then(response => response.text())
    .then(data => {
        appendChat("robot", data);
    })
    .catch(error => console.error('Error:', error));
}