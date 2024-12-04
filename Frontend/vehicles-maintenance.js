document.getElementById('maintenanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const vehicle = document.getElementById('vehicle').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;

    const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle, service, date })
    });

    if (response.ok) {
        alert('Record added successfully!');
        closeForm();
        loadRecords();
    } else {
        alert('Failed to add record.');
    }
});

document.getElementById('scheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const vehicle = document.getElementById('vehicle-schedule').value;
    const date = document.getElementById('schedule-date').value;

    const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle, date })
    });

    if (response.ok) {
        alert('Schedule added successfully!');
        closeScheduleForm();
        loadSchedules();
    } else {
        alert('Failed to add schedule.');
    }
});

function openForm() {
    document.getElementById('formPopup').style.display = 'block';
}

function closeForm() {
    document.getElementById('formPopup').style.display = 'none';
}

function openScheduleForm() {
    document.getElementById('schedulePopup').style.display = 'block';
}

function closeScheduleForm() {
    document.getElementById('schedulePopup').style.display = 'none';
}

async function loadRecords() {
    const response = await fetch('/api/maintenance');
    const records = await response.json();

    const list = document.getElementById('maintenance-list');
    list.innerHTML = records.map(record => `
      <div>
        <h3>Vehicle: ${record.vehicle}</h3>
        <p>Service: ${record.service}</p>
        <p>Date: ${record.date}</p>
      </div>
    `).join('');
}

async function loadSchedules() {
    const response = await fetch('/api/schedule');
    const schedules = await response.json();

    const list = document.getElementById('schedule-list');
    list.innerHTML = schedules.map(schedule => `
      <div>
        <h3>Vehicle: ${schedule.vehicle}</h3>
        <p>Scheduled Date: ${schedule.date}</p>
      </div>
    `).join('');
}

async function loadHistory() {
    const response = await fetch('/api/history');
    const history = await response.json();

    const list = document.getElementById('history-list');
    list.innerHTML = history.map(item => `
      <div>
        <h3>Vehicle: ${item.vehicle}</h3>
        <p>Service: ${item.service}</p>
        <p>Date: ${item.date}</p>
      </div>
    `).join('');
}

loadRecords();
loadSchedules();
loadHistory();
