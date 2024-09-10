document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = document.getElementById('calendar');
    const selectedDateElement = document.getElementById('selected-date');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks-list');
    const monthYearElement = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const workCategoryBtn = document.getElementById('work-category');
    const importantCategoryBtn = document.getElementById('important-category');
    const schoolCategoryBtn = document.getElementById('school-category');
    const personalCategoryBtn = document.getElementById('personal-category');
    const birthdaysCategoryBtn = document.getElementById('birthdays-category');
    const nameInput = document.getElementById('name-input');
    const greetingMessage = document.getElementById('greeting-message');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDate = null;
    let isWorkCategorySelected = false;
    let isImportantCategorySelected = false;
    let isSchoolCategorySelected = false;
    let isPersonalCategorySelected = false;
    let isBirthdaysCategorySelected = false;

    function createCalendar(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let calendarHtml = '<table><tr>';
        const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        for (let i = 0; i < daysOfWeek.length; i++) {
            calendarHtml += `<th>${daysOfWeek[i]}</th>`;
        }
        calendarHtml += '</tr><tr>';

        for (let i = 0; i < firstDay; i++) {
            calendarHtml += '<td></td>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${month + 1}-${day}`;
            calendarHtml += `<td class="calendar-day" data-date="${date}">${day}</td>`;
            if ((day + firstDay) % 7 === 0) {
                calendarHtml += '</tr><tr>';
            }
        }

        calendarHtml += '</tr></table>';
        calendarElement.innerHTML = calendarHtml;
        monthYearElement.innerText = `${getMonthName(month)} ${year}`;
    }

    function getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }

    function loadTasks(date) {
        tasksList.innerHTML = ''; // Clear the tasks list
        const tasksForDate = tasks[date] || [];

        tasksForDate.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.innerText = task.text;

            if (task.category === 'work') {
                taskItem.style.backgroundColor = '#e0f7fa';
                taskItem.style.borderLeft = '5px solid #00acc1';
            } else if (task.category === 'important') {
                taskItem.classList.add('important');
            } else if (task.category === 'school') {
                taskItem.style.backgroundColor = '#e6ffe6';
                taskItem.style.borderLeft = '5px solid #339933';
            } else if (task.category === 'personal') {
                taskItem.style.backgroundColor = '#f3e5f5';
                taskItem.style.borderLeft = '5px solid #6a1b9a';
            } else if (task.category === 'birthdays') {
                taskItem.style.backgroundColor = '#fff9e5';
                taskItem.style.borderLeft = '5px solid #fdd835';
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.addEventListener('click', () => {
                deleteTask(date, index);
            });

            taskItem.appendChild(deleteBtn);
            tasksList.appendChild(taskItem);
        });
    }

    function addTask(date, taskText) {
        let taskCategory;
        if (isWorkCategorySelected) {
            taskCategory = 'work';
        } else if (isImportantCategorySelected) {
            taskCategory = 'important';
        } else if (isSchoolCategorySelected) {
            taskCategory = 'school';
        } else if (isPersonalCategorySelected) {
            taskCategory = 'personal';
        } else if (isBirthdaysCategorySelected) {
            taskCategory = 'birthdays';
        } else {
            taskCategory = 'default';
        }

        const task = { text: taskText, category: taskCategory };

        if (!tasks[date]) tasks[date] = [];
        tasks[date].push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks(date);
    }

    function deleteTask(date, taskIndex) {
        tasks[date].splice(taskIndex, 1);
        if (tasks[date].length === 0) delete tasks[date];

        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks(date);
    }

    prevMonthBtn.addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        createCalendar(currentYear, currentMonth);
    });

    nextMonthBtn.addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        createCalendar(currentYear, currentMonth);
    });

    calendarElement.addEventListener('click', function (e) {
        if (e.target.classList.contains('calendar-day')) {
            const clickedDate = e.target.getAttribute('data-date');

            if (selectedDate === clickedDate) {
                e.target.classList.remove('selected');
                selectedDate = null;
                selectedDateElement.innerHTML = 'No date selected';
                tasksList.innerHTML = '';
            } else {
                const previouslySelected = document.querySelector('.calendar-day.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }

                e.target.classList.add('selected');
                selectedDate = clickedDate;

                const clickedDateObj = new Date(clickedDate);
                const month = getMonthName(clickedDateObj.getMonth());
                const day = clickedDateObj.getDate();
                const year = clickedDateObj.getFullYear();

                selectedDateElement.innerHTML = `<strong>${month} ${day}</strong>, ${year}`;

                loadTasks(selectedDate);
            }
        }
    });

    addTaskBtn.addEventListener('click', function () {
        if (selectedDate && taskInput.value.trim() !== '') {
            addTask(selectedDate, taskInput.value.trim());
            taskInput.value = '';
        }
    });

    workCategoryBtn.addEventListener('click', function () {
        isWorkCategorySelected = !isWorkCategorySelected;
        workCategoryBtn.classList.toggle('selected', isWorkCategorySelected);
        workCategoryBtn.classList.toggle('active', isWorkCategorySelected);
        if (isWorkCategorySelected) {
            isImportantCategorySelected = false;
            isSchoolCategorySelected = false;
            isPersonalCategorySelected = false;
            isBirthdaysCategorySelected = false;
            importantCategoryBtn.classList.remove('selected', 'active');
            schoolCategoryBtn.classList.remove('selected', 'active');
            personalCategoryBtn.classList.remove('selected', 'active');
            birthdaysCategoryBtn.classList.remove('selected', 'active');
        }
    });

    importantCategoryBtn.addEventListener('click', function () {
        isImportantCategorySelected = !isImportantCategorySelected;
        importantCategoryBtn.classList.toggle('selected', isImportantCategorySelected);
        importantCategoryBtn.classList.toggle('active', isImportantCategorySelected);
        if (isImportantCategorySelected) {
            isWorkCategorySelected = false;
            isSchoolCategorySelected = false;
            isPersonalCategorySelected = false;
            isBirthdaysCategorySelected = false;
            workCategoryBtn.classList.remove('selected', 'active');
            schoolCategoryBtn.classList.remove('selected', 'active');
            personalCategoryBtn.classList.remove('selected', 'active');
            birthdaysCategoryBtn.classList.remove('selected', 'active');
        }
    });

    schoolCategoryBtn.addEventListener('click', function () {
        isSchoolCategorySelected = !isSchoolCategorySelected;
        schoolCategoryBtn.classList.toggle('selected', isSchoolCategorySelected);
        schoolCategoryBtn.classList.toggle('active', isSchoolCategorySelected);
        if (isSchoolCategorySelected) {
            isWorkCategorySelected = false;
            isImportantCategorySelected = false;
            isPersonalCategorySelected = false;
            isBirthdaysCategorySelected = false;
            workCategoryBtn.classList.remove('selected', 'active');
            importantCategoryBtn.classList.remove('selected', 'active');
            personalCategoryBtn.classList.remove('selected', 'active');
            birthdaysCategoryBtn.classList.remove('selected', 'active');
        }
    });

    personalCategoryBtn.addEventListener('click', function () {
        isPersonalCategorySelected = !isPersonalCategorySelected;
        personalCategoryBtn.classList.toggle('selected', isPersonalCategorySelected);
        personalCategoryBtn.classList.toggle('active', isPersonalCategorySelected);
        if (isPersonalCategorySelected) {
            isWorkCategorySelected = false;
            isImportantCategorySelected = false;
            isSchoolCategorySelected = false;
            isBirthdaysCategorySelected = false;
            workCategoryBtn.classList.remove('selected', 'active');
            importantCategoryBtn.classList.remove('selected', 'active');
            schoolCategoryBtn.classList.remove('selected', 'active');
            birthdaysCategoryBtn.classList.remove('selected', 'active');
        }
    });

    birthdaysCategoryBtn.addEventListener('click', function () {
        isBirthdaysCategorySelected = !isBirthdaysCategorySelected;
        birthdaysCategoryBtn.classList.toggle('selected', isBirthdaysCategorySelected);
        birthdaysCategoryBtn.classList.toggle('active', isBirthdaysCategorySelected);
        if (isBirthdaysCategorySelected) {
            isWorkCategorySelected = false;
            isImportantCategorySelected = false;
            isSchoolCategorySelected = false;
            isPersonalCategorySelected = false;
            workCategoryBtn.classList.remove('selected', 'active');
            importantCategoryBtn.classList.remove('selected', 'active');
            schoolCategoryBtn.classList.remove('selected', 'active');
            personalCategoryBtn.classList.remove('selected', 'active');
        }
    });

    nameInput.addEventListener('input', function () {
        const name = nameInput.value.trim();
        if (name) {
            greetingMessage.innerText = `Hello, ${name}.`;
        } else {
            greetingMessage.innerText = '';
        }
    });

    createCalendar(currentYear, currentMonth);

    if (selectedDate) {
        loadTasks(selectedDate);
    }
});
