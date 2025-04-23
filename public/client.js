const socket = io();
let userName;
let textarea = document.querySelector('#textArea');
let messageArea = document.querySelector('.messageArea');
let contName = document.querySelector('.contName');

do {
    userName = prompt('Please enter your name: ');
} while (!userName);

socket.emit('register', userName);

document.querySelector('.sendButton').addEventListener('click', () => {
    if (textarea.value.trim() !== "") {
        sendMessage(textarea.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: userName,
        message: message.trim(),
        id: socket.id
    };
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

socket.on('message', (msg) => {
    if (msg.id !== socket.id) {
        appendMessage(msg, 'incoming');
        scrollToBottom();
    }
});

socket.on('updateUsers', (users) => {
    let otherUsers = Object.values(users).filter(user => user !== userName);
    contName.textContent = otherUsers.length > 0 ? otherUsers[0] : 'No other users connected';
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}