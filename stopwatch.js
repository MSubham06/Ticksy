let stopwatchInterval;
let stopwatchSeconds = 0;
let isStopwatchRunning = false;
let lapCount = 1;
const startStopwatchBtn = document.getElementById('start-stopwatch');
const pauseStopwatchBtn = document.getElementById('pause-stopwatch');
const resetStopwatchBtn = document.getElementById('reset-stopwatch');
const stopwatchDisplay = document.getElementById('stopwatch-display');
const lapTimes = document.getElementById('lap-times');

function updateStopwatchDisplay() {
  const hours = Math.floor(stopwatchSeconds / 3600);
  const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
  const seconds = stopwatchSeconds % 60;
  const milliseconds = 0; // For future enhancement
  
  stopwatchDisplay.textContent = 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startStopwatch() {
  if (isStopwatchRunning) return;
  
  isStopwatchRunning = true;
  startStopwatchBtn.disabled = true;
  pauseStopwatchBtn.disabled = false;
  resetStopwatchBtn.disabled = false;
  
  stopwatchInterval = setInterval(() => {
    stopwatchSeconds++;
    updateStopwatchDisplay();
  }, 1000);
}

function pauseStopwatch() {
  if (!isStopwatchRunning) return;
  
  clearInterval(stopwatchInterval);
  isStopwatchRunning = false;
  startStopwatchBtn.disabled = false;
  pauseStopwatchBtn.disabled = true;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  isStopwatchRunning = false;
  stopwatchSeconds = 0;
  lapCount = 1;
  updateStopwatchDisplay();
  lapTimes.innerHTML = '';
  startStopwatchBtn.disabled = false;
  pauseStopwatchBtn.disabled = true;
  resetStopwatchBtn.disabled = true;
}

function addLapTime() {
  const lapItem = document.createElement('div');
  lapItem.className = 'lap-item';
  lapItem.innerHTML = `
    <span class="lap-number">Lap ${lapCount}</span>
    <span class="lap-time">${stopwatchDisplay.textContent}</span>
  `;
  lapTimes.prepend(lapItem);
  lapCount++;
}

// For future enhancement: Add lap button
// const lapBtn = document.createElement('button');
// lapBtn.className = 'btn secondary';
// lapBtn.textContent = 'Lap';
// lapBtn.addEventListener('click', addLapTime);
// document.querySelector('.action-buttons').appendChild(lapBtn);

startStopwatchBtn.addEventListener('click', startStopwatch);
pauseStopwatchBtn.addEventListener('click', pauseStopwatch);
resetStopwatchBtn.addEventListener('click', resetStopwatch);

// Initialize
updateStopwatchDisplay();
pauseStopwatchBtn.disabled = true;
resetStopwatchBtn.disabled = true;