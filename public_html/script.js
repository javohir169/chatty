document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const aliasInput = document.getElementById('aliasInput');
    const messageInput = document.getElementById('messageInput');
    const chatWindow = document.getElementById('chatWindow');

    // Function to send messages to the server
    function sendMessage() {
        const alias = aliasInput.value.trim();
        const message = messageInput.value.trim();

        if (alias && message) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/chats/post');
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    messageInput.value = '';
                    aliasInput.value = '';
                }
            };
            xhr.send(JSON.stringify({ alias, message }));
        }
    }

    // Function to fetch messages from the server
    function fetchMessages() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/chats');
        xhr.onload = function() {
            if (xhr.status === 200) {
                const messages = JSON.parse(xhr.responseText);
                updateChatWindow(messages);
            }
        };
        xhr.send();
    }

    // Update the chat window with new messages
    function updateChatWindow(messages) {
        chatWindow.innerHTML = '';
        messages.forEach(function(message) {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<strong>${message.alias}:</strong> ${message.message}`;
            chatWindow.appendChild(messageElement);
        });
    }

    // Event listener for sending messages
    sendButton.addEventListener('click', sendMessage);

    // Set up an interval to fetch messages periodically
    setInterval(fetchMessages, 1000);
});
