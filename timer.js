let timerInterval;
let timerSeconds = 0;
let isTimerRunning = false;
const startTimerBtn = document.getElementById('start-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;
  
  timerDisplay.textContent = 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (isTimerRunning) return;
  
  const hours = parseInt(document.getElementById('timer-hours').value) || 0;
  const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
  const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;
  
  timerSeconds = hours * 3600 + minutes * 60 + seconds;
  
  if (timerSeconds <= 0) {
    alert('Please set a valid time');
    return;
  }
  
  isTimerRunning = true;
  startTimerBtn.textContent = 'Running...';
  startTimerBtn.disabled = true;
  
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      startTimerBtn.textContent = 'Start';
      startTimerBtn.disabled = false;
      alert('Timer finished!');
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = 0;
  updateTimerDisplay();
  startTimerBtn.textContent = 'Start';
  startTimerBtn.disabled = false;
  
  // Reset inputs
  document.getElementById('timer-hours').value = '0';
  document.getElementById('timer-minutes').value = '0';
  document.getElementById('timer-seconds').value = '0';
}

startTimerBtn.addEventListener('click', startTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Initialize
updateTimerDisplay();