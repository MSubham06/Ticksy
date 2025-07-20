// Current Mode (clock, alarm, timer, stopwatch)
let currentMode = 'clock';

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
let isDarkMode = true;

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    body.style.backgroundColor = '#000000';
    body.style.color = '#FFFFFF';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    body.style.backgroundColor = '#FFFFFF';
    body.style.color = '#000000';
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
});

// Mode switching
const modeButtons = {
  'clock': document.getElementById('clock-btn'),
  'alarm': document.getElementById('alarm-btn'),
  'timer': document.getElementById('timer-btn'),
  'stopwatch': document.getElementById('stopwatch-btn')
};

const modeControls = {
  'clock': null,
  'alarm': document.getElementById('alarm-controls'),
  'timer': document.getElementById('timer-controls'),
  'stopwatch': document.getElementById('stopwatch-controls')
};

const modeIcons = {
  'clock': document.getElementById('clock-icon'),
  'alarm': document.querySelector('#alarm-btn .icon'),
  'timer': document.querySelector('#timer-btn .icon'),
  'stopwatch': document.querySelector('#stopwatch-btn .icon')
};

function switchMode(mode) {
  currentMode = mode;
  
  // Update active state of buttons
  Object.values(modeIcons).forEach(icon => icon.classList.remove('active'));
  modeIcons[mode].classList.add('active');
  
  // Hide all controls
  Object.values(modeControls).forEach(control => {
    if (control) control.classList.remove('active');
  });
  
  // Show current mode controls
  if (modeControls[mode]) {
    modeControls[mode].classList.add('active');
  }
}

// Add event listeners to mode buttons
Object.entries(modeButtons).forEach(([mode, button]) => {
  button.addEventListener('click', () => switchMode(mode));
});

// Clock functionality
function updateClock() {
  const now = new Date();
  const options = { 
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  const timeString = now.toLocaleTimeString('en-IN', options);
  document.getElementById('digital-clock').textContent = timeString;
  
  // Update date display
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString('en-IN', dateOptions);
  document.getElementById('date-display').textContent = dateString;
}

// Update time immediately and then every second
updateClock();
setInterval(updateClock, 1000);

// Alarm functionality
const alarms = [];
const alarmList = document.getElementById('alarm-list');
const setAlarmBtn = document.getElementById('set-alarm');

function checkAlarms() {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  
  alarms.forEach((alarm, index) => {
    // Convert alarm time to 24-hour format for comparison
    let alarmHours = alarm.hours;
    if (alarm.amPm === 'PM' && alarmHours < 12) {
      alarmHours += 12;
    } else if (alarm.amPm === 'AM' && alarmHours === 12) {
      alarmHours = 0;
    }
    
    if (alarmHours === currentHours && 
        alarm.minutes === currentMinutes && 
        currentSeconds === 0) {
      alert(`Alarm! It's ${alarm.hours}:${alarm.minutes} ${alarm.amPm}`);
    }
  });
}

setAlarmBtn.addEventListener('click', () => {
  const hours = parseInt(document.getElementById('alarm-hours').value);
  const minutes = parseInt(document.getElementById('alarm-minutes').value);
  const amPm = document.getElementById('alarm-am-pm').value;
  
  // Validate input
  if (hours < 0 || hours > 12 || minutes < 0 || minutes > 59) {
    alert('Please enter valid time');
    return;
  }
  
  // Add alarm to list
  alarms.push({ hours, minutes, amPm });
  renderAlarms();
});

function renderAlarms() {
  alarmList.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const alarmItem = document.createElement('div');
    alarmItem.className = 'alarm-item';
    alarmItem.innerHTML = `
      <span class="time">${alarm.hours.toString().padStart(2, '0')}:${alarm.minutes.toString().padStart(2, '0')} ${alarm.amPm}</span>
      <span class="delete" data-index="${index}"><i class="fas fa-trash"></i></span>
    `;
    alarmList.appendChild(alarmItem);
  });
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      alarms.splice(index, 1);
      renderAlarms();
    });
  });
  
  alarmList.classList.add('active');
}

// Check alarms every second
setInterval(checkAlarms, 1000);

// Timer functionality
let timerInterval;
let timerSeconds = 0;
const startTimerBtn = document.getElementById('start-timer');
const resetTimerBtn = document.getElementById('reset-timer');

function updateTimerDisplay() {
  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;
  
  document.getElementById('timer-hours').value = hours;
  document.getElementById('timer-minutes').value = minutes;
  document.getElementById('timer-seconds').value = seconds;
}

function startTimer() {
  const hours = parseInt(document.getElementById('timer-hours').value) || 0;
  const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
  const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;
  
  timerSeconds = hours * 3600 + minutes * 60 + seconds;
  
  if (timerSeconds <= 0) {
    alert('Please set a valid time');
    return;
  }
  
  startTimerBtn.textContent = 'Running...';
  startTimerBtn.disabled = true;
  
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      startTimerBtn.textContent = 'Start';
      startTimerBtn.disabled = false;
      alert('Timer finished!');
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 0;
  updateTimerDisplay();
  startTimerBtn.textContent = 'Start';
  startTimerBtn.disabled = false;
}

startTimerBtn.addEventListener('click', startTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Stopwatch functionality
let stopwatchInterval;
let stopwatchSeconds = 0;
const startStopwatchBtn = document.getElementById('start-stopwatch');
const pauseStopwatchBtn = document.getElementById('pause-stopwatch');
const resetStopwatchBtn = document.getElementById('reset-stopwatch');
const stopwatchDisplay = document.getElementById('stopwatch-display');

function updateStopwatchDisplay() {
  const hours = Math.floor(stopwatchSeconds / 3600);
  const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
  const seconds = stopwatchSeconds % 60;
  
  stopwatchDisplay.textContent = 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startStopwatch() {
  startStopwatchBtn.disabled = true;
  pauseStopwatchBtn.disabled = false;
  
  stopwatchInterval = setInterval(() => {
    stopwatchSeconds++;
    updateStopwatchDisplay();
  }, 1000);
}

function pauseStopwatch() {
  clearInterval(stopwatchInterval);
  startStopwatchBtn.disabled = false;
  pauseStopwatchBtn.disabled = true;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchSeconds = 0;
  updateStopwatchDisplay();
  startStopwatchBtn.disabled = false;
  pauseStopwatchBtn.disabled = true;
}

startStopwatchBtn.addEventListener('click', startStopwatch);
pauseStopwatchBtn.addEventListener('click', pauseStopwatch);
resetStopwatchBtn.addEventListener('click', resetStopwatch);
