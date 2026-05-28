const STORAGE_KEY = 'visioners_timetracker_mobile';

let records = [];

const employees = {
    1: 'Иванов Иван',
    2: 'Петров Петр',
    3: 'Сидорова Анна',
    4: 'Козлов Дмитрий'
};

const projects = {
    1: 'Цифровое правосудие',
    2: 'Мобильный банк РСХБ',
    3: 'Платформа аналитики X5',
    4: 'Внутренний портал visioners'
};

const employeeSelect = document.getElementById('employeeSelect');
const projectSelect = document.getElementById('projectSelect');
const hoursInput = document.getElementById('hoursInput');
const dateInput = document.getElementById('dateInput');
const descInput = document.getElementById('descInput');
const addBtn = document.getElementById('addBtn');
const filterSelect = document.getElementById('filterSelect');
const resetBtn = document.getElementById('resetBtn');
const recordsList = document.getElementById('recordsList');
const totalHoursSpan = document.getElementById('totalHours');

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        records = JSON.parse(saved);
    } else {
        records = [
            { id: 1, employeeId: 1, projectId: 1, hours: 4, date: '2026-05-28', description: 'Разработка API' },
            { id: 2, employeeId: 2, projectId: 2, hours: 2.5, date: '2026-05-28', description: 'Созвон с заказчиком' },
            { id: 3, employeeId: 3, projectId: 1, hours: 3, date: '2026-05-27', description: 'Анализ требований' }
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function generateId() {
    if (records.length === 0) return 1;
    return Math.max(...records.map(r => r.id)) + 1;
}

function addRecord() {
    const employeeId = parseInt(employeeSelect.value);
    const projectId = parseInt(projectSelect.value);
    const hours = parseFloat(hoursInput.value);
    const date = dateInput.value;
    const description = descInput.value.trim();

    if (!hours || hours <= 0) {
        alert('Введите часы (больше 0)');
        return;
    }
    if (!date) {
        alert('Выберите дату');
        return;
    }
    if (!description) {
        alert('Введите описание');
        return;
    }

    const newRecord = {
        id: generateId(),
        employeeId: employeeId,
        projectId: projectId,
        hours: hours,
        date: date,
        description: description
    };

    records.unshift(newRecord);
    saveData();

    hoursInput.value = '';
    descInput.value = '';
    dateInput.value = '';

    render();
}

function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    saveData();
    render();
}

function getFilteredRecords() {
    const filter = filterSelect.value;
    if (filter === 'all') return records;
    return records.filter(r => r.employeeId == filter);
}

function calculateTotalHours() {
    const filtered = getFilteredRecords();
    let total = 0;
    filtered.forEach(r => total += r.hours);
    return total;
}

function renderRecords() {
    const filtered = getFilteredRecords();

    if (filtered.length === 0) {
        recordsList.innerHTML = '<div class="empty-msg">📭 Нет записей</div>';
        return;
    }

    recordsList.innerHTML = '';
    filtered.forEach(record => {
        const item = document.createElement('div');
        item.className = 'record-item';

        item.innerHTML = `
            <div class="record-info">
                <div class="record-employee">${employees[record.employeeId]}</div>
                <div class="record-project">📁 ${projects[record.projectId]}</div>
                <div class="record-desc">📝 ${record.description}</div>
                <div class="record-desc">📅 ${record.date}</div>
            </div>
            <div class="record-hours">${record.hours} ч</div>
            <button class="delete-btn" data-id="${record.id}">🗑️</button>
        `;

        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteRecord(record.id));

        recordsList.appendChild(item);
    });
}

function renderStats() {
    totalHoursSpan.innerHTML = `${calculateTotalHours()} ч`;
}

function render() {
    renderStats();
    renderRecords();
}

function resetAll() {
    if (confirm('Удалить все данные?')) {
        records = [];
        saveData();
        render();
    }
}

addBtn.addEventListener('click', addRecord);
resetBtn.addEventListener('click', resetAll);
filterSelect.addEventListener('change', render);

loadData();
render();