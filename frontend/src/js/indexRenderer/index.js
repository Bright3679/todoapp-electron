// document.addEventListener('DOMContentLoaded', async () => {
//     const todoForm = document.getElementById('todo-form');
//     const todoInput = document.getElementById('todo-input');
//     const todoList = document.getElementById('todo-list');
//     const clearAll = document.getElementById('clear-all-btn');
//     const logoutBtn = document.getElementById('logout-btn')
//     const showtodoBtn = document.getElementById('show-button');

//     // const token = localStorage.getItem('token');
//     const taskToken = localStorage.getItem('taskToken');

//     showtodoBtn.addEventListener('click', async () => {
//         window.location.href = 'frontend/src/pages/showTasks.html';
//     })


//     const fetchedTaskNames = new Set();
//     if (taskToken) {
//         try {
//             const response = await fetch('http://localhost:3000/api/', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${taskToken}`
//                 }
//             });
//             if (!response.ok) {
//                 // throw new Error('Failed to fetch tasks');
//                 Swal.fire({
//                     text: 'No Tasks Available!',
//                     icon: 'error',
//                     backdrop: false,
//                     timer: 1000,
//                     showConfirmButton: false
//                 })
//             }
//             const data = await response.json();
//             data.data.forEach(task => {
//                 if (!fetchedTaskNames.has(task.taskName)) {
//                     addTodoItem(task.taskName);
//                     fetchedTaskNames.add(task.taskName);
//                 }
//             });


//         } catch (error) {
//             console.error('Error fetching tasks:', error);
//         }
//     }


//     logoutBtn.addEventListener('click', function () {
//         Swal.fire({
//             title: "Confirm logout!",
//             text: "Are you sure you want to log out?",
//             icon: "question",
//             backdrop: false,
//             showCancelButton: true,
//             cancelButtonText: "Cancel",
//             confirmButtonText: "Logout",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('taskTopic');
//                 localStorage.removeItem('taskToken');
//                 window.location.href = './frontend/src/pages/login.html';
//             }
//         });
//     });

//     todoForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const task = todoInput.value.trim();
//         if (task === '') {
//             Swal.fire({
//                 title: 'Input Task',
//                 text: 'Please enter a task!',
//                 icon: 'error',
//                 backdrop: false,
//                 timer: 1000,
//                 timerProgressBar: true,
//                 showConfirmButton: false
//             })
//         }
//         try {
//             const response = await fetch('http://localhost:3000/api/insertTask', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ taskToken, task })
//             })
//             const data = await response.json();

//             if (response.ok) {
//                 addTodoItem(task);
//                 todoInput.value = '';
//             } else {
//                 Swal.fire({
//                     // title: 'Error',
//                     text: data.message || 'Error inserting task',
//                     icon: 'error',
//                     backdrop: false,
//                     timer: 1000,
//                     showConfirmButton: false
//                 })
//             }
//         } catch (error) {
//             console.error("Error:", error)
//         }
//     });

//     clearAll.addEventListener('click', () => {
//         todoList.innerHTML = '';
//         fetchedTaskNames.clear();
//     });

//     function addTodoItem(task) {
//         const todoCount = todoList.children.length + 1;
//         const todoItem = document.createElement('div');
//         todoItem.className = 'todo-item';
//         todoItem.id = 'todo-item-' + todoCount;

//         todoItem.innerHTML = `
//         <div class="task-number">${todoCount}</div>
//         <div class="task-text">${task}</div>
//         <div class="task-actions">
//           <button class="complete-btn" onclick="completeTodoItem('todo-item-${todoCount}')">Complete</button>
//           <button class="edit-btn" onclick="editTodoItem('todo-item-${todoCount}')">Edit</button>
//           <button class="delete-btn" onclick="deleteTodoItem('todo-item-${todoCount}')">Delete</button>
//         </div>
//       `;

//         todoList.appendChild(todoItem);
//     }

//     window.completeTodoItem = function (id) {
//         const todoItem = document.getElementById(id);
//         const taskTextElement = todoItem.querySelector('.task-text');
//         taskTextElement.classList.toggle('completed');
//     };

//     window.editTodoItem = function (id) {
//         const todoItem = document.getElementById(id);
//         const taskTextElement = todoItem.querySelector('.task-text');

//         Swal.fire({
//             title: 'Edit Task',
//             input: 'text',
//             inputValue: taskTextElement.textContent,
//             showCancelButton: true,
//             confirmButtonText: 'Save',
//             cancelButtonText: 'Cancel',
//             backdrop: false,
//             inputValidator: (value) => {
//                 if (!value.trim()) {
//                     return 'Task cannot be empty!';
//                 }
//             },
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 taskTextElement.textContent = result.value.trim();
//             }
//         });
//     };

//     window.deleteTodoItem = function (id) {
//         const todoItem = document.getElementById(id);
//         todoItem.remove();
//         updateTaskNumbers();
//     };

//     function updateTaskNumbers() {
//         const todoItems = todoList.querySelectorAll('.todo-item');
//         todoItems.forEach((item, index) => {
//             const taskNumberElement = item.querySelector('.task-number');
//             taskNumberElement.textContent = index + 1;
//             item.id = 'todo-item-' + (index + 1);
//             item.querySelector('.complete-btn').setAttribute('onclick', `completeTodoItem('todo-item-${index + 1}')`);
//             item.querySelector('.edit-btn').setAttribute('onclick', `editTodoItem('todo-item-${index + 1}')`);
//             item.querySelector('.delete-btn').setAttribute('onclick', `deleteTodoItem('todo-item-${index + 1}')`);
//         });
//     }
// });

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const showtodoBtn = document.getElementById('show-button');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');

    // State
    const taskToken = localStorage.getItem('taskToken');
    const fetchedTaskNames = new Set();
    let tasks = [];

    // Initialize the app
    initApp();

    // Event Listeners
    showtodoBtn?.addEventListener('click', () => {
        window.location.href = 'frontend/src/pages/showTasks.html';
    });

    logoutBtn?.addEventListener('click', handleLogout);

    todoForm?.addEventListener('submit', handleAddTask);

    clearAllBtn?.addEventListener('click', handleClearAll);

    // Functions
    async function initApp() {
        try {
            if (taskToken) {
                await fetchTasks();
                updateTaskStats();
            } else {
                Swal.fire({
                    title: 'Session Error',
                    text: 'Please login again',
                    icon: 'error',
                    willClose: () => {
                        window.location.href = './frontend/src/pages/login.html';
                    }
                });
            }
        } catch (error) {
            console.error('Initialization error:', error);
            showError('Failed to initialize application');
        }
    }

    async function fetchTasks() {
        try {
            showLoading('Loading tasks...');
            const response = await fetch('http://localhost:3000/api/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${taskToken}`
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                data.data.forEach(task => {
                    if (!fetchedTaskNames.has(task.taskName)) {
                        tasks.push({
                            id: Date.now() + Math.random().toString(36).substr(2, 9),
                            name: task.taskName,
                            completed: false
                        });
                        fetchedTaskNames.add(task.taskName);
                    }
                });
                renderTasks();
            } else {
                Swal.fire({
                    text: 'No tasks found. Add your first task!',
                    icon: 'info',
                    backdrop: false,
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Fetch tasks error:', error);
            showError('Failed to load tasks');
        } finally {
            Swal.close();
        }
    }

    async function handleAddTask(e) {
        e.preventDefault();
        const taskName = todoInput.value.trim();

        if (!taskName) {
            showError('Please enter a task!');
            return;
        }

        try {
            showLoading('Adding task...');
            const response = await fetch('http://localhost:3000/api/insertTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${taskToken}`
                },
                body: JSON.stringify({ taskToken, task: taskName })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error inserting task');
            }

            // Add to local state
            tasks.push({
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                name: taskName,
                completed: false
            });
            
            renderTasks();
            todoInput.value = '';
            updateTaskStats();
            
            Swal.fire({
                text: 'Task added successfully!',
                icon: 'success',
                backdrop: false,
                timer: 1000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Add task error:', error);
            showError(error.message || 'Failed to add task');
        } finally {
            Swal.close();
        }
    }

    function handleClearAll() {
        Swal.fire({
            title: 'Clear All Tasks?',
            text: 'This will remove all your tasks permanently',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Clear All',
            cancelButtonText: 'Cancel',
            backdrop: false
        }).then((result) => {
            if (result.isConfirmed) {
                tasks = [];
                fetchedTaskNames.clear();
                renderTasks();
                updateTaskStats();
                
                Swal.fire({
                    text: 'All tasks cleared!',
                    icon: 'success',
                    backdrop: false,
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        });
    }

    function handleLogout() {
        Swal.fire({
            title: 'Confirm Logout',
            text: 'Are you sure you want to log out?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            backdrop: false
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('taskTopic');
                localStorage.removeItem('taskToken');
                window.location.href = './frontend/src/pages/login.html';
            }
        });
    }

    function renderTasks() {
        if (!todoList) return;

        if (tasks.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tasks yet. Add your first task!</p>
                </div>
            `;
            return;
        }

        todoList.innerHTML = '';
        tasks.forEach((task, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${task.completed ? 'completed' : ''}`;
            todoItem.id = `todo-item-${task.id}`;

            todoItem.innerHTML = `
                <div class="task-number">${index + 1}</div>
                <div class="task-text">${task.name}</div>
                <div class="task-actions">
                    <button class="complete-btn" onclick="completeTodoItem('${task.id}')">
                        <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                    </button>
                    <button class="edit-btn" onclick="editTodoItem('${task.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTodoItem('${task.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

            todoList.appendChild(todoItem);
        });
    }

    function updateTaskStats() {
        if (totalTasksEl) {
            totalTasksEl.textContent = tasks.length;
        }
        if (completedTasksEl) {
            completedTasksEl.textContent = tasks.filter(t => t.completed).length;
        }
    }

    // Global functions (attached to window)
    window.completeTodoItem = function (id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
            updateTaskStats();
        }
    };

    window.editTodoItem = function (id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        Swal.fire({
            title: 'Edit Task',
            input: 'text',
            inputValue: task.name,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            backdrop: false,
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'Task cannot be empty!';
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    showLoading('Updating task...');
                    const response = await fetch('http://localhost:3000/api/updateTask', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${taskToken}`
                        },
                        body: JSON.stringify({ 
                            taskToken,
                            oldTask: task.name,
                            newTask: result.value.trim()
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update task');
                    }

                    task.name = result.value.trim();
                    renderTasks();
                    
                    Swal.fire({
                        text: 'Task updated!',
                        icon: 'success',
                        backdrop: false,
                        timer: 1000,
                        showConfirmButton: false
                    });
                } catch (error) {
                    console.error('Update task error:', error);
                    showError('Failed to update task');
                } finally {
                    Swal.close();
                }
            }
        });
    };

    window.deleteTodoItem = function (id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        Swal.fire({
            title: 'Delete Task?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            backdrop: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    showLoading('Deleting task...');
                    const response = await fetch('http://localhost:3000/api/deleteTask', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${taskToken}`
                        },
                        body: JSON.stringify({ 
                            taskToken,
                            task: task.name
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete task');
                    }

                    tasks = tasks.filter(t => t.id !== id);
                    renderTasks();
                    updateTaskStats();
                    
                    Swal.fire({
                        text: 'Task deleted!',
                        icon: 'success',
                        backdrop: false,
                        timer: 1000,
                        showConfirmButton: false
                    });
                } catch (error) {
                    console.error('Delete task error:', error);
                    showError('Failed to delete task');
                } finally {
                    Swal.close();
                }
            }
        });
    };

    // Helper functions
    function showLoading(message) {
        Swal.fire({
            title: message,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    function showError(message) {
        Swal.fire({
            text: message,
            icon: 'error',
            backdrop: false,
            timer: 1500,
            showConfirmButton: false
        });
    }
});

// document.addEventListener('DOMContentLoaded', async () => {
//     const todoForm = document.getElementById('todo-form');
//     const todoInput = document.getElementById('todo-input');
//     const priorityInput = document.getElementById('priority');
//     const remarkInput = document.getElementById('remark');
//     const reminderInput = document.getElementById('reminder');
//     const todoList = document.getElementById('todo-list');
//     const clearAll = document.getElementById('clear-all-btn');
//     const logoutBtn = document.getElementById('logout-btn');
//     const showtodoBtn = document.getElementById('show-button');

//     const taskToken = localStorage.getItem('taskToken');
//     const fetchedTaskNames = new Set();
//     const localTasks = []; // Track tasks for reminders

//     showtodoBtn.addEventListener('click', () => {
//         window.location.href = 'frontend/src/pages/showTasks.html';
//     });

//     if (taskToken) {
//         try {
//             const response = await fetch('http://localhost:3000/api/', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${taskToken}`
//                 }
//             });

//             if (!response.ok) {
//                 Swal.fire({
//                     text: 'No Tasks Available!',
//                     icon: 'error',
//                     backdrop: false,
//                     timer: 1000,
//                     showConfirmButton: false
//                 });
//             }

//             const data = await response.json();
//             data.data.forEach(task => {
//                 if (!fetchedTaskNames.has(task.taskName)) {
//                     addTodoItem(task.taskName);
//                     fetchedTaskNames.add(task.taskName);
//                 }
//             });

//         } catch (error) {
//             console.error('Error fetching tasks:', error);
//         }
//     }

//     logoutBtn.addEventListener('click', function () {
//         Swal.fire({
//             title: "Confirm logout!",
//             text: "Are you sure you want to log out?",
//             icon: "question",
//             backdrop: false,
//             showCancelButton: true,
//             cancelButtonText: "Cancel",
//             confirmButtonText: "Logout",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('taskTopic');
//                 localStorage.removeItem('taskToken');
//                 window.location.href = './frontend/src/pages/login.html';
//             }
//         });
//     });

//     todoForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const task = todoInput.value.trim();
//         const priority = priorityInput.value;
//         const remark = remarkInput.value.trim();
//         const reminder = reminderInput.value;

//         if (task === '') {
//             Swal.fire({
//                 title: 'Input Task',
//                 text: 'Please enter a task!',
//                 icon: 'error',
//                 backdrop: false,
//                 timer: 1000,
//                 timerProgressBar: true,
//                 showConfirmButton: false
//             });
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:3000/api/insertTask', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ taskToken, task })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 addTodoItem(task, priority, remark, reminder);
//                 todoForm.reset();
//             } else {
//                 Swal.fire({
//                     text: data.message || 'Error inserting task',
//                     icon: 'error',
//                     backdrop: false,
//                     timer: 1000,
//                     showConfirmButton: false
//                 });
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     });

//     clearAll.addEventListener('click', () => {
//         todoList.innerHTML = '';
//         fetchedTaskNames.clear();
//         localTasks.length = 0;
//     });

//     function getPriorityColor(priority) {
//         switch (priority) {
//             case "High": return "red";
//             case "Medium": return "orange";
//             case "Low": return "green";
//             default: return "black";
//         }
//     }

//     function addTodoItem(task, priority = "Medium", remark = "", reminder = "") {
//         const todoCount = todoList.children.length + 1;
//         const todoItem = document.createElement('div');
//         todoItem.className = 'todo-item';
//         todoItem.id = 'todo-item-' + todoCount;

//         todoItem.innerHTML = `
//             <div class="task-number">${todoCount}</div>
//             <div class="task-text">${task}</div>
//             <div class="task-meta">
//                 <span class="priority" style="color:${getPriorityColor(priority)}">Priority: ${priority}</span><br>
//                 <span class="remark">Remark: ${remark || "None"}</span><br>
//                 <span class="reminder">Reminder: ${reminder ? new Date(reminder).toLocaleString() : "None"}</span>
//             </div>
//             <div class="task-actions">
//                 <button class="complete-btn" onclick="completeTodoItem('todo-item-${todoCount}')">Complete</button>
//                 <button class="edit-btn" onclick="editTodoItem('todo-item-${todoCount}')">Edit</button>
//                 <button class="delete-btn" onclick="deleteTodoItem('todo-item-${todoCount}')">Delete</button>
//             </div>
//         `;

//         todoList.appendChild(todoItem);

//         if (reminder) {
//             localTasks.push({
//                 id: todoItem.id,
//                 task,
//                 reminder,
//                 notified: false
//             });
//         }
//     }

//     window.completeTodoItem = function (id) {
//         const todoItem = document.getElementById(id);
//         const taskTextElement = todoItem.querySelector('.task-text');
//         taskTextElement.classList.toggle('completed');
//     };

//     window.editTodoItem = function (id) {
//         const todoItem = document.getElementById(id);
//         const taskTextElement = todoItem.querySelector('.task-text');

//         Swal.fire({
//             title: 'Edit Task',
//             input: 'text',
//             inputValue: taskTextElement.textContent,
//             showCancelButton: true,
//             confirmButtonText: 'Save',
//             cancelButtonText: 'Cancel',
//             backdrop: false,
//             inputValidator: (value) => {
//                 if (!value.trim()) {
//                     return 'Task cannot be empty!';
//                 }
//             },
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 taskTextElement.textContent = result.value.trim();
//             }
//         });
//     };

//     window.deleteTodoItem = function (id) {
//         const todoItem = document.getElementById(id);
//         todoItem.remove();
//         updateTaskNumbers();
//     };

//     function updateTaskNumbers() {
//         const todoItems = todoList.querySelectorAll('.todo-item');
//         todoItems.forEach((item, index) => {
//             const taskNumberElement = item.querySelector('.task-number');
//             taskNumberElement.textContent = index + 1;
//             item.id = 'todo-item-' + (index + 1);
//             item.querySelector('.complete-btn').setAttribute('onclick', `completeTodoItem('todo-item-${index + 1}')`);
//             item.querySelector('.edit-btn').setAttribute('onclick', `editTodoItem('todo-item-${index + 1}')`);
//             item.querySelector('.delete-btn').setAttribute('onclick', `deleteTodoItem('todo-item-${index + 1}')`);
//         });
//     }

//     // ⏰ Reminder checker
//     setInterval(() => {
//         const now = new Date();
//         localTasks.forEach(task => {
//             if (!task.notified && new Date(task.reminder) <= now) {
//                 Swal.fire({
//                     title: "Reminder!",
//                     text: `It's time for: ${task.task}`,
//                     icon: "info",
//                     confirmButtonText: "OK",
//                     backdrop: false
//                 });
//                 task.notified = true;
//             }
//         });
//     }, 60000); // every 1 minute
// });
