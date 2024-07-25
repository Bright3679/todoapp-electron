document.addEventListener("DOMContentLoaded", function (event) {
    event.preventDefault();
    const topicname = document.getElementById("taskTopic")
    const token = localStorage.getItem('token')

    async function fetchTopics() {
        try {
            const response = await fetch('http://localhost:3000/api/getTopicsName', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch topics');
            }
            const result = await response.json();
            const topicsList = document.getElementById('topics');
            topicsList.innerHTML = '';
            result.data.forEach(topic => {
                const listItem = document.createElement('li');
                listItem.textContent = topic.topicName;
                topicsList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch topics. Please try again later.',
                backdrop: false,
                timer: 1000,
                showConfirmButton: false

            });
        }
    }

    fetchTopics();

    topicBtn.addEventListener("click", async () => {
        const topicValue = topicname.value.trim();

        try {
            const response = await fetch('http://localhost:3000/api/createTaskTopic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topicValue, token })
            })
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("taskToken", data.taskToken)
                localStorage.setItem("taskTopic", topicValue)
                Swal.fire({
                    text: "Task Created!",
                    icon: "success",
                    backdrop: false,
                    timer: 1000,
                    timerPrograssBar: true,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "../../../index.html"
                })
            } else {
                Swal.fire({
                    text: data.message || "error while Creating Task!",
                    icon: "error",
                    backdrop: false,
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

            }
        } catch (error) {
            console.error(error)
            Swal.fire({
                text: "Network Error!",
                icon: "error",
                backdrop: false,
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    })
})