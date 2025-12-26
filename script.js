document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const timeDisplay = document.getElementById('time');
    const mainBtn = document.getElementById('main-btn');
    const resetBtn = document.getElementById('reset-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sessionCount = document.getElementById('session-count');
    const liveClock = document.getElementById('live-clock');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Custom Inputs
    const customTab = document.getElementById('custom-tab');
    const customInputs = document.getElementById('custom-inputs');
    const customHrs = document.getElementById('custom-hrs');
    const customMins = document.getElementById('custom-mins');
    const setCustomBtn = document.getElementById('set-custom-btn');

    // Audio Elements
    const musicPanel = document.getElementById('music-panel');
    const musicToggle = document.getElementById('music-toggle');
    const closeMusic = document.getElementById('close-music');
    const soundBtns = document.querySelectorAll('.sound-item');
    const volumeSlider = document.getElementById('volume');
    
    // Tasks
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // --- State ---
    let timer = null;
    let timeLeft = 25 * 60;
    let initialTime = 25 * 60;
    let isRunning = false;
    let currentMode = 'pomodoro'; 
    let sessions = parseInt(localStorage.getItem('ticksy_sessions')) || 0;
    let tasks = JSON.parse(localStorage.getItem('ticksy_tasks')) || [];

    // --- Init ---
    sessionCount.textContent = sessions;
    renderTasks();
    setInterval(updateLiveClock, 1000); 
    updateLiveClock();

    function updateLiveClock() {
        const now = new Date();
        liveClock.textContent = now.toLocaleTimeString('en-US', { hour12: true }); 
    }

    // --- Timer Logic ---
    const modes = {
        pomodoro: 25 * 60,
        short: 5 * 60,
        long: 15 * 60
    };

    function updateDisplay() {
        const h = Math.floor(timeLeft / 3600);
        const m = Math.floor((timeLeft % 3600) / 60);
        const s = timeLeft % 60;
        
        let displayStr = '';
        if (h > 0) {
            displayStr += `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        } else {
            displayStr += `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        
        timeDisplay.textContent = displayStr;
        document.title = `${displayStr} - Ticksy`;
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            mainBtn.textContent = 'START';
            mainBtn.classList.remove('active');
        } else {
            isRunning = true;
            mainBtn.textContent = 'PAUSE';
            mainBtn.classList.add('active');
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    completeSession();
                }
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        mainBtn.textContent = 'START';
        timeLeft = initialTime;
        updateDisplay();
    }

    function completeSession() {
        clearInterval(timer);
        isRunning = false;
        mainBtn.textContent = 'START';
        document.getElementById('audio-alert').play();
        
        if (currentMode === 'pomodoro' || currentMode === 'custom') {
            sessions++;
            sessionCount.textContent = sessions;
            localStorage.setItem('ticksy_sessions', sessions);
        }
    }

    // --- Tab Switching ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const mode = btn.dataset.mode;
            currentMode = mode;

            if (mode === 'custom') {
                customInputs.classList.remove('hidden');
            } else {
                customInputs.classList.add('hidden');
                timeLeft = modes[mode];
                initialTime = timeLeft;
                updateDisplay();
                resetTimer();
            }
        });
    });

    setCustomBtn.addEventListener('click', () => {
        const h = parseInt(customHrs.value) || 0;
        const m = parseInt(customMins.value) || 0;
        if (h === 0 && m === 0) return;
        timeLeft = (h * 3600) + (m * 60);
        initialTime = timeLeft;
        updateDisplay();
        resetTimer();
        customInputs.classList.add('hidden');
    });

    // --- Full Screen ---
    fullscreenBtn.addEventListener('click', () => {
        document.body.classList.toggle('fullscreen-active');
        const icon = fullscreenBtn.querySelector('i');
        if (document.body.classList.contains('fullscreen-active')) {
            icon.classList.replace('fa-expand', 'fa-compress');
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(e => {});
        } else {
            icon.classList.replace('fa-compress', 'fa-expand');
            if (document.exitFullscreen) document.exitFullscreen().catch(e => {});
        }
    });

    // --- Audio Logic (Updated) ---
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate closing
        musicPanel.classList.toggle('hidden');
    });
    
    closeMusic.addEventListener('click', () => {
        musicPanel.classList.add('hidden');
    });

    // Close music panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!musicPanel.contains(e.target) && !musicToggle.contains(e.target)) {
            musicPanel.classList.add('hidden');
        }
    });

    soundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const soundName = btn.dataset.sound;
            const audio = document.getElementById(`audio-${soundName}`);
            
            if (btn.classList.contains('active')) {
                audio.pause();
                btn.classList.remove('active');
            } else {
                // Optional: Pause others if you want single-stream
                document.querySelectorAll('audio').forEach(a => { if(a.id !== 'audio-alert') a.pause(); });
                document.querySelectorAll('.sound-item').forEach(b => b.classList.remove('active'));

                audio.volume = volumeSlider.value;
                audio.play();
                btn.classList.add('active');
            }
        });
    });

    volumeSlider.addEventListener('input', (e) => {
        document.querySelectorAll('audio').forEach(a => { if(a.id !== 'audio-alert') a.volume = e.target.value; });
    });

    // --- Common ---
    mainBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);

    // --- Tasks ---
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.done ? 'done' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''} onclick="toggleTask(${index})">
                <span onclick="toggleTask(${index})">${task.text}</span>
                <button class="delete-task" onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
            `;
            taskList.appendChild(li);
        });
    }

    window.toggleTask = (index) => {
        tasks[index].done = !tasks[index].done;
        saveTasks();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
    };

    function saveTasks() {
        localStorage.setItem('ticksy_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, done: false });
            taskInput.value = '';
            saveTasks();
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTaskBtn.click();
    });
});