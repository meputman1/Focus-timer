let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

const encouragingMessages = [
    "You're doing great! Keep going! 🎯",
    "Stay focused, you've got this! 💪",
    "You're making amazing progress! 🌟",
    "Keep pushing forward! 🚀",
    "You're crushing it! Keep going! ⭐"
];

function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'encouragement-message';
    messageDiv.textContent = message;
    
    // Remove any existing message
    const existingMessage = document.querySelector('.encouragement-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    document.querySelector('.container').appendChild(messageDiv);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Show encouraging message at 20, 15, 10, and 5 minutes
    if (minutes > 0 && minutes <= 20 && minutes % 5 === 0 && seconds === 0) {
        showMessage(encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]);
    }
}

function startTimer() {
    if (timerId === null) {
        // Show initial message
        showMessage("Ready, Set, Go! 🚀");
        
        // Remove initial message after 10 seconds
        setTimeout(() => {
            const initialMessage = document.querySelector('.encouragement-message');
            if (initialMessage && initialMessage.textContent === "Ready, Set, Go! 🚀") {
                initialMessage.remove();
            }
        }, 10000);
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                alert('Time is up! Great job staying focused! 🎉');
                timeLeft = 25 * 60;
                updateDisplay();
            }
        }, 1000);
        
        startBtn.disabled = true;
    }
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    startBtn.disabled = false;
    // Remove any existing message when stopping
    const existingMessage = document.querySelector('.encouragement-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    updateDisplay();
    startBtn.disabled = false;
    // Remove any existing message when resetting
    const existingMessage = document.querySelector('.encouragement-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay(); 