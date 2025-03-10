document.addEventListener('DOMContentLoaded', async () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const clearAll = document.getElementById('clear-all-btn');
    const logoutBtn = document.getElementById('logout-btn')
    const showtodoBtn = document.getElementById('show-button');

    // const token = localStorage.getItem('token');
    const taskToken = localStorage.getItem('taskToken');

    showtodoBtn.addEventListener('click', async () => {
        window.location.href = 'frontend/src/pages/showTasks.html';
    })


    const fetchedTaskNames = new Set();
    if (taskToken) {
        try {
            const response = await fetch('http://localhost:3000/api/gettasks', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${taskToken}`
                }
            });
            if (!response.ok) {
                // throw new Error('Failed to fetch tasks');
                Swal.fire({
                    text: 'No Tasks Available!',
                    icon: 'error',
                    backdrop: false,
                    timer: 1000,
                    showConfirmButton: false
                })
            }
            const data = await response.json();
            data.data.forEach(task => {
                if (!fetchedTaskNames.has(task.taskName)) {
                    addTodoItem(task.taskName);
                    fetchedTaskNames.add(task.taskName);
                }
            });


        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }


    logoutBtn.addEventListener('click', function () {
        Swal.fire({
            title: "Confirm logout!",
            text: "Are you sure you want to log out?",
            icon: "question",
            backdrop: false,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Logout",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('taskTopic');
                localStorage.removeItem('taskToken');
                window.location.href = './frontend/src/pages/login.html';
            }
        });
    });

    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const task = todoInput.value.trim();
        if (task === '') {
            Swal.fire({
                title: 'Input Task',
                text: 'Please enter a task!',
                icon: 'error',
                backdrop: false,
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            })
        }
        try {
            const response = await fetch('http://localhost:3000/api/insertTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ taskToken, task })
            })
            const data = await response.json();

            if (response.ok) {
                addTodoItem(task);
                todoInput.value = '';
            } else {
                Swal.fire({
                    // title: 'Error',
                    text: data.message || 'Error inserting task',
                    icon: 'error',
                    backdrop: false,
                    timer: 1000,
                    showConfirmButton: false
                })
            }
        } catch (error) {
            console.error("Error:", error)
        }
    });

    clearAll.addEventListener('click', () => {
        todoList.innerHTML = '';
        fetchedTaskNames.clear();
    });

    function addTodoItem(task) {
        const todoCount = todoList.children.length + 1;
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.id = 'todo-item-' + todoCount;

        todoItem.innerHTML = `
        <div class="task-number">${todoCount}</div>
        <div class="task-text">${task}</div>
        <div class="task-actions">
          <button class="complete-btn" onclick="completeTodoItem('todo-item-${todoCount}')">Complete</button>
          <button class="edit-btn" onclick="editTodoItem('todo-item-${todoCount}')">Edit</button>
          <button class="delete-btn" onclick="deleteTodoItem('todo-item-${todoCount}')">Delete</button>
        </div>
      `;

        todoList.appendChild(todoItem);
    }

    window.completeTodoItem = function (id) {
        const todoItem = document.getElementById(id);
        const taskTextElement = todoItem.querySelector('.task-text');
        taskTextElement.classList.toggle('completed');
    };

    window.editTodoItem = function (id) {
        const todoItem = document.getElementById(id);
        const taskTextElement = todoItem.querySelector('.task-text');

        Swal.fire({
            title: 'Edit Task',
            input: 'text',
            inputValue: taskTextElement.textContent,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            backdrop: false,
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'Task cannot be empty!';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                taskTextElement.textContent = result.value.trim();
            }
        });
    };

    window.deleteTodoItem = function (id) {
        const todoItem = document.getElementById(id);
        todoItem.remove();
        updateTaskNumbers();
    };

    function updateTaskNumbers() {
        const todoItems = todoList.querySelectorAll('.todo-item');
        todoItems.forEach((item, index) => {
            const taskNumberElement = item.querySelector('.task-number');
            taskNumberElement.textContent = index + 1;
            item.id = 'todo-item-' + (index + 1);
            item.querySelector('.complete-btn').setAttribute('onclick', `completeTodoItem('todo-item-${index + 1}')`);
            item.querySelector('.edit-btn').setAttribute('onclick', `editTodoItem('todo-item-${index + 1}')`);
            item.querySelector('.delete-btn').setAttribute('onclick', `deleteTodoItem('todo-item-${index + 1}')`);
        });
    }
});
