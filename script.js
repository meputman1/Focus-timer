let timerId = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDropdown = document.getElementById('timerDropdown');
const breakDropdown = document.getElementById('breakDropdown');

const encouragingMessagesMap = {
    5: [
        "You can do anything for 5 minutes! 🚀",
        "Just 5 minutes, let's go! 💪",
        "Quick win! Stay focused! 🏁"
    ],
    10: [
        "10 minutes of greatness! 🌟",
        "Double high five! You got this! 🙌",
        "10 minutes, 0 distractions! 🧘"
    ],
    15: [
        "15 minutes to shine! ✨",
        "Keep up the momentum! 🔥",
        "You're on a roll! 🏆"
    ],
    20: [
        "20 minutes, keep it up! 💚",
        "Stay strong for 20! 💪",
        "Almost halfway! Keep going! 🏃"
    ],
    25: [
        "Classic Pomodoro! 🍅",
        "25 minutes of focus! 👏",
        "You're crushing it! 💥"
    ],
    30: [
        "Half an hour of power! ⚡",
        "30 minutes, you legend! 🦸",
        "Keep the focus alive! 🔒"
    ],
    35: [
        "35 minutes, wow! 🎉",
        "You're unstoppable! 🚴",
        "Keep up the great work! 👍"
    ],
    40: [
        "40 minutes, amazing! 🥇",
        "Stay in the zone! 🧠",
        "You're doing fantastic! 🌈"
    ],
    45: [
        "45 minutes, almost there! 🕒",
        "Keep pushing! 💥",
        "You're a focus master! 🧙"
    ],
    50: [
        "50 minutes, so close! 🏁",
        "Incredible focus! 👀",
        "Finish strong! 💯"
    ],
    55: [
        "55 minutes, wow! 🏆",
        "Almost done! 🏅",
        "Keep going, champion! 🥇"
    ],
    60: [
        "One hour! You're amazing! 🕐",
        "60 minutes of greatness! 🌟",
        "You did it! 🎊"
    ]
};

const breakMessages = [
    "Break time! Stretch and relax! 🧘‍♂️",
    "Great job! Enjoy your break! ☕",
    "Rest up, you earned it! 🌿",
    "Take a deep breath and recharge! 🌬️",
    "Step away and refresh! 🚶"
];

let selectedMinutes = parseInt(timerDropdown.value);
let selectedBreakMinutes = parseInt(breakDropdown.value);
let timeLeft = selectedMinutes * 60;
let isBreak = false;

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
    
    // Show encouraging message at each 5-minute mark (except 0)
    if (!isBreak && minutes > 0 && minutes % 5 === 0 && seconds === 0) {
        const messages = encouragingMessagesMap[selectedMinutes] || ["Keep going!"];
        showMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
}

function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.value = 0.1;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        ctx.close();
    }, 200);
}

function startTimer() {
    if (timerId === null) {
        if (!isBreak) {
            showMessage("Ready, Set, Go! 🚀");
        } else {
            showMessage("Break time! Enjoy and recharge! 🌿");
        }
        setTimeout(() => {
            const initialMessage = document.querySelector('.encouragement-message');
            if (initialMessage && (initialMessage.textContent === "Ready, Set, Go! 🚀" || initialMessage.textContent === "Break time! Enjoy and recharge! 🌿")) {
                initialMessage.remove();
            }
        }, 10000);
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                if (!isBreak) {
                    // Focus session ended, check break duration
                    playBeep();
                    showMessage("🎉 Congratulations! You completed your focus session! 🎉");
                    setTimeout(() => {
                        const congratsMsg = document.querySelector('.encouragement-message');
                        if (congratsMsg && congratsMsg.textContent.includes('Congratulations!')) {
                            congratsMsg.remove();
                        }
                    }, 5000);
                    if (selectedBreakMinutes === 0) {
                        // Skip break, go straight to next focus session
                        alert('Focus complete! No break selected. Ready for another focus session?');
                        isBreak = false;
                        timeLeft = selectedMinutes * 60;
                        updateDisplay();
                        startBtn.disabled = false;
                    } else {
                        // Start break as usual
                        showMessage("Focus complete! Time for a break! ☕");
                        setTimeout(() => {
                            const msg = document.querySelector('.encouragement-message');
                            if (msg && msg.textContent === "Focus complete! Time for a break! ☕") {
                                msg.remove();
                            }
                        }, 5000);
                        isBreak = true;
                        timeLeft = selectedBreakMinutes * 60;
                        setTimeout(() => {
                            startTimer();
                            // Show a random break message
                            showMessage(breakMessages[Math.floor(Math.random() * breakMessages.length)]);
                            setTimeout(() => {
                                const breakMsg = document.querySelector('.encouragement-message');
                                if (breakMsg && breakMessages.includes(breakMsg.textContent)) {
                                    breakMsg.remove();
                                }
                            }, 10000);
                        }, 1000);
                    }
                } else {
                    // Break ended, reset to focus
                    playBeep();
                    showMessage("👏 Great job! Break is over! Ready for another focus session?");
                    setTimeout(() => {
                        const breakCongrats = document.querySelector('.encouragement-message');
                        if (breakCongrats && breakCongrats.textContent.includes('Break is over')) {
                            breakCongrats.remove();
                        }
                    }, 5000);
                    alert('Break is over! Ready for another focus session?');
                    isBreak = false;
                    timeLeft = selectedMinutes * 60;
                    updateDisplay();
                    startBtn.disabled = false;
                }
            }
        }, 1000);
        startBtn.disabled = true;
    }
}

timerDropdown.addEventListener('change', function() {
    selectedMinutes = parseInt(timerDropdown.value);
    if (!isBreak) {
        timeLeft = selectedMinutes * 60;
        updateDisplay();
    }
    // Remove any existing message when changing duration
    const existingMessage = document.querySelector('.encouragement-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    startBtn.disabled = false;
});

breakDropdown.addEventListener('change', function() {
    selectedBreakMinutes = parseInt(breakDropdown.value);
    if (isBreak) {
        timeLeft = selectedBreakMinutes * 60;
        updateDisplay();
    }
    // Remove any existing message when changing duration
    const existingMessage = document.querySelector('.encouragement-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    startBtn.disabled = false;
});

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
    isBreak = false;
    timeLeft = selectedMinutes * 60;
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