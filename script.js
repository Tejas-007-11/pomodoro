const particles = document.querySelector('.particles');
        for (let i = 0; i < 15; i++) {
            const size = Math.random() * 100 + 50;
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
            particles.appendChild(particle);
        }

        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const minutesInput = document.getElementById('minutes');
        const display = document.querySelector('.display');
        const statusText = document.querySelector('.status');
        const backgroundMusic = document.getElementById('backgroundMusic');
        const alarmSound = document.getElementById('alarmSound');
        const sessionsCount = document.getElementById('sessionsCount');
        const totalMinutes = document.getElementById('totalMinutes');
        const streak = document.getElementById('streak');
        const quoteText = document.getElementById('quote');
        const quoteAuthor = document.getElementById('author');
        const tipContent = document.getElementById('tip');

        let timeLeft = 0;
        let timerId = null;
        let sessions = 0;
        let totalTime = 0;
        let currentStreak = 0;

        const quotes = [
            { text: "Time is the most valuable thing a man can spend.", author: "Theophrastus" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
        ];

        const tips = [
            "Break large tasks into smaller, manageable chunks for better focus.",
            "Stay hydrated during your focus sessions.",
            "Take short breaks between sessions to maintain productivity.",
            "Create a dedicated workspace free from distractions.",
            "Use the 2-minute rule: if it takes less than 2 minutes, do it now."
        ];

        function updateQuote() {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = `- ${randomQuote.author}`;
        }

        function updateTip() {
            tipContent.textContent = tips[Math.floor(Math.random() * tips.length)];
        }

        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function validateInput() {
            let minutes = parseInt(minutesInput.value);
            if (isNaN(minutes) || minutes < 1) {
                minutes = 1;
            } else if (minutes > 180) {
                minutes = 180;
            }
            minutesInput.value = minutes;
            return minutes;
        }

        function startTimer() {
            if (timerId === null) {
                const minutes = validateInput();
                if (!timeLeft) {
                    timeLeft = minutes * 60;
                    totalTime += minutes;
                    totalMinutes.textContent = totalTime;
                }
                
                backgroundMusic.play();
                startBtn.textContent = 'Pause';
                statusText.textContent = 'Focus time!';
                minutesInput.disabled = true;
                
                timerId = setInterval(() => {
                    timeLeft--;
                    updateDisplay();

                    if (timeLeft <= 0) {
                        clearInterval(timerId);
                        timerId = null;
                        backgroundMusic.pause();
                        backgroundMusic.currentTime = 0;
                        alarmSound.play();
                        startBtn.textContent = 'Start';
                        minutesInput.disabled = false;
                        statusText.textContent = 'Time is up! Take a break.';
                        sessions++;
                        currentStreak++;
                        sessionsCount.textContent = sessions;
                        streak.textContent = currentStreak;
                        updateQuote();
                        updateTip();
                        showSessionForm();
                    }
                }, 1000);
            } else {
                clearInterval(timerId);
                timerId = null;
                backgroundMusic.pause();
                startBtn.textContent = 'Resume';
                statusText.textContent = 'Paused';
            }
        }

        function resetTimer() {
            clearInterval(timerId);
            timerId = null;
            timeLeft = 0;
            minutesInput.disabled = false;
            minutesInput.value = '';
            updateDisplay();
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            startBtn.textContent = 'Start';
            statusText.textContent = 'Enter time and press Start';
        }

// Popup Form Functions
function showSessionForm() {
    sessionForm.style.display = "flex";
}

function closeSessionForm() {
    sessionForm.style.display = "none";
}

submitNotes.addEventListener("click", () => {
    const notes = document.getElementById("sessionNotes").value;
    console.log("User Session Notes:", notes);
    alert("Notes saved!");
    closeSessionForm();
});

closeForm.addEventListener("click", closeSessionForm);

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
updateDisplay();

minutesInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startTimer();
    }
});

minutesInput.addEventListener('input', () => {
    if (minutesInput.value < 0) minutesInput.value = 0;
});

// Initialize quotes and tips
updateQuote();
updateTip();

// Update quotes and tips periodically
setInterval(() => {
    if (!timerId) { // Only update when timer is not running
        updateQuote();
        updateTip();
    }
}, 30000);

// Load and save streak from localStorage
const savedStreak = localStorage.getItem('streak');
const lastSessionDate = localStorage.getItem('lastSessionDate');
const today = new Date().toDateString();

if (savedStreak && lastSessionDate === today) {
    currentStreak = parseInt(savedStreak);
    streak.textContent = currentStreak;
} else if (lastSessionDate && lastSessionDate !== today) {
    // Reset streak if not used yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastSessionDate !== yesterday.toDateString()) {
        currentStreak = 0;
        streak.textContent = currentStreak;
    }
}

// Save streak after each session
function saveStreak() {
    localStorage.setItem('streak', currentStreak);
    localStorage.setItem('lastSessionDate', new Date().toDateString());
}

// Save streak before page unload
window.addEventListener('beforeunload', saveStreak);

// Handle visibility change for background music
document.addEventListener('visibilitychange', () => {
    if (document.hidden && backgroundMusic.playing) {
        backgroundMusic.pause();
    } else if (!document.hidden && timerId !== null) {
        backgroundMusic.play();
    }
});

// Prevent accidental page refresh
window.addEventListener('beforeunload', (e) => {
    if (timerId !== null) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Add touch support for mobile devices
let touchStartY = 0;
minutesInput.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

minutesInput.addEventListener('touchmove', (e) => {
    const touchCurrentY = e.touches[0].clientY;
    const diff = touchStartY - touchCurrentY;
    const currentValue = parseInt(minutesInput.value) || 0;
    
    if (Math.abs(diff) > 10) { // Threshold for touch movement
        if (diff > 0 && currentValue < 180) {
            minutesInput.value = currentValue + 1;
        } else if (diff < 0 && currentValue > 1) {
            minutesInput.value = currentValue - 1;
        }
        touchStartY = touchCurrentY;
    }
});





