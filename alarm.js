const alarms = [];
const alarmList = document.getElementById("alarm-list");
const setAlarmBtn = document.getElementById("set-alarm");

// Load alarms from localStorage
function loadAlarms() {
  const savedAlarms = localStorage.getItem("alarms");
  if (savedAlarms) {
    alarms.push(...JSON.parse(savedAlarms));
    renderAlarms();
  }
}

// Save alarms to localStorage
function saveAlarms() {
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function checkAlarms() {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();

  alarms.forEach((alarm, index) => {
    // Convert alarm time to 24-hour format for comparison
    let alarmHours = alarm.hours;
    if (alarm.amPm === "PM" && alarmHours < 12) {
      alarmHours += 12;
    }
    else if (alarm.amPm === "AM" && alarmHours === 12) {
      alarmHours = 0;
    }

    if (
      alarmHours === currentHours &&
      alarm.minutes === currentMinutes &&
      currentSeconds === 0
    ) {
      alert(
        `Alarm! It's ${alarm.hours}:${alarm.minutes
          .toString()
          .padStart(2, "0")} ${alarm.amPm}`
      );
    }
  });
}

setAlarmBtn.addEventListener("click", () => {
  const hours = parseInt(document.getElementById("alarm-hours").value);
  const minutes = parseInt(document.getElementById("alarm-minutes").value);
  const amPm = document.getElementById("alarm-am-pm").value;

  // Validate input
  if (isNaN(hours)) {
    alert("Please enter valid hours");
    return;
  }

  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    alert("Please enter valid minutes (0-59)");
    return;
  }

  // Add alarm to list
  alarms.push({
    hours: hours > 12 ? 12 : hours < 1 ? 1 : hours,
    minutes: minutes,
    amPm,
  });

  saveAlarms();
  renderAlarms();

  // Reset inputs
  document.getElementById("alarm-hours").value = "12";
  document.getElementById("alarm-minutes").value = "00";
});

function renderAlarms() {
  alarmList.innerHTML = "";

  if (alarms.length === 0) {
    alarmList.innerHTML = '<p class="no-alarms">No alarms set</p>';
    return;
  }

  // Sort alarms by time
  alarms.sort((a, b) => {
    const timeA = convertTo24Hour(a.hours, a.minutes, a.amPm);
    const timeB = convertTo24Hour(b.hours, b.minutes, b.amPm);
    return timeA - timeB;
  });

  alarms.forEach((alarm, index) => {
    const alarmItem = document.createElement("div");
    alarmItem.className = "alarm-item";
    alarmItem.innerHTML = `
      <span class="time">${alarm.hours
        .toString()
        .padStart(2, "0")}:${alarm.minutes.toString().padStart(2, "0")} ${
      alarm.amPm
    }</span>
      <span class="delete" data-index="${index}"><i class="fas fa-trash"></i></span>
    `;
    alarmList.appendChild(alarmItem);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      alarms.splice(index, 1);
      saveAlarms();
      renderAlarms();
    });
  });
}

function convertTo24Hour(hours, minutes, amPm) {
  let h = hours;
  if (amPm === "PM" && h < 12) h += 12;
  if (amPm === "AM" && h === 12) h = 0;
  return h * 100 + minutes; // Combine hours and minutes for sorting
}

// Check alarms every second
setInterval(checkAlarms, 1000);

// Initialize
loadAlarms();
