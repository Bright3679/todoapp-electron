document.addEventListener('DOMContentLoaded', async () => {
    // const backBtn = document.getElementById('Back');
    const downloadBtn = document.getElementById('Download');
    const taskToken = localStorage.getItem('taskToken')

    downloadBtn.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const taskList = document.getElementById("task-list");
        const tasks = taskList.querySelectorAll("li");
        let yPosition = 10;

        doc.setFontSize(16);
        doc.text("Your Tasks", 10, yPosition);
        yPosition += 10;

        tasks.forEach((task, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${task.textContent}`, 10, yPosition);
            yPosition += 10;
        });

        doc.save("task-list.pdf");
    })

    // backBtn.addEventListener('click', function () {
    //     window.location.href = '../../../../index.html'
    // })

    const token = localStorage.getItem('token');

    if (taskToken) {
        try {
            const response = await fetch('http://localhost:3000/api/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${taskToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
            const taskList = document.getElementById('task-list');

            data.data.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = task.taskName;
                taskList.appendChild(taskItem);
            });

        } catch (error) {
            console.error('Error fetching tasks:', error);
            Swal.fire({
                text: 'Failed to fetch tasks!',
                icon: 'error',
                backdrop: false,
                timer: 2000,
                showConfirmButton: false
            });
        }
    }
});
