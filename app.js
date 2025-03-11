document.addEventListener('DOMContentLoaded', function() {
    // Global variables and DOM references
    let tasks = [];
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskName');
    const taskPointsInput = document.getElementById('taskPoints');
    const totalPointsSpan = document.getElementById('totalPoints');
    const resetDayBtn = document.getElementById('resetDayBtn');
  
    // LocalStorage keys
    const TASKS_KEY = 'chores_tasks';
    const LAST_RESET_KEY = 'chores_lastReset';
  
    // Helper: Get today’s date in YYYY-MM-DD format
    function getTodayDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  
    // Load tasks from localStorage
    function loadTasks() {
      const storedTasks = localStorage.getItem(TASKS_KEY);
      tasks = storedTasks ? JSON.parse(storedTasks) : [];
    }
  
    // Save tasks to localStorage
    function saveTasks() {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
  
    // Reset tasks' completion if a new day has begun
    function checkDayReset() {
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      const today = getTodayDate();
      if (lastReset !== today) {
        // Reset completion status of all tasks for the new day
        tasks.forEach(task => task.completed = false);
        localStorage.setItem(LAST_RESET_KEY, today);
        saveTasks();
      }
    }
    
    // Calculate total points of completed chores
    function calculateTotalPoints() {
      return tasks.reduce((total, task) => task.completed ? total + Number(task.points) : total, 0);
    }
  
    // Update total points display
    function updateTotalPoints() {
      totalPointsSpan.textContent = calculateTotalPoints();
    }
  
    // Render tasks to the UI
    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        
        // Create div for task info
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
  
        // Checkbox for completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
          task.completed = checkbox.checked;
          saveTasks();
          updateTotalPoints();
        });
  
        // Task name and assigned points
        const spanName = document.createElement('span');
        spanName.className = 'task-name';
        spanName.textContent = task.name;
  
        const spanPoints = document.createElement('span');
        spanPoints.className = 'task-points';
        spanPoints.textContent = `(${task.points} pts)`;
  
        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(spanName);
        taskInfo.appendChild(spanPoints);
        li.appendChild(taskInfo);
  
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
          tasks = tasks.filter(t => t.id !== task.id);
          saveTasks();
          renderTasks();
          updateTotalPoints();
        });
        li.appendChild(deleteBtn);
  
        taskList.appendChild(li);
      });
    }
  
    // Event handler for adding a new task
    addTaskBtn.addEventListener('click', () => {
      const name = taskNameInput.value.trim();
      const points = taskPointsInput.value.trim();
      if (!name || !points) {
        alert('Please enter both chore name and points.');
        return;
      }
      const task = {
        id: Date.now(),
        name,
        points,
        completed: false
      };
      tasks.push(task);
      saveTasks();
      renderTasks();
      taskNameInput.value = '';
      taskPointsInput.value = '';
    });
  
    // Reset Day button: manually resets the completed status of all tasks
    resetDayBtn.addEventListener('click', () => {
      tasks.forEach(task => task.completed = false);
      localStorage.setItem(LAST_RESET_KEY, getTodayDate());
      saveTasks();
      renderTasks();
      updateTotalPoints();
    });
  
    // Initial load and setup
    loadTasks();
    checkDayReset();
    renderTasks();
    updateTotalPoints();
  });
  