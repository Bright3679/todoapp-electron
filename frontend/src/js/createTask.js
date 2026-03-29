// document.addEventListener("DOMContentLoaded", function (event) {
//     event.preventDefault();
//     const topicname = document.getElementById("taskTopic")
//     const token = localStorage.getItem('token')

//     async function fetchTopics() {
//         try {
//             const response = await fetch('http://localhost:3000/api/getTopicsName', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch topics');
//             }
//             const result = await response.json();
//             const topicsList = document.getElementById('topics');
//             topicsList.innerHTML = '';
//             result.data.forEach(topic => {
//                 const listItem = document.createElement('li');
//                 listItem.textContent = topic.topicName;
//                 topicsList.appendChild(listItem);
//             });
//         } catch (error) {
//             console.error('Error:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Failed to fetch topics. Please try again later.',
//                 backdrop: false,
//                 timer: 1000,
//                 showConfirmButton: false

//             });
//         }
//     }

//     fetchTopics();

//     topicBtn.addEventListener("click", async () => {
//         const topicValue = topicname.value.trim();

//         try {
//             const response = await fetch('http://localhost:3000/api/createTaskTopic', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ topicValue, token })
//             })
//             const data = await response.json();
//             if (response.ok) {
//                 localStorage.setItem("taskToken", data.taskToken)
//                 localStorage.setItem("taskTopic", topicValue)
//                 Swal.fire({
//                     text: "Task Created!",
//                     icon: "success",
//                     backdrop: false,
//                     timer: 1000,
//                     timerPrograssBar: true,
//                     showConfirmButton: false
//                 }).then(() => {
//                     window.location.href = "../../../index.html"
//                 })
//             } else {
//                 Swal.fire({
//                     text: data.message || "error while Creating Task!",
//                     icon: "error",
//                     backdrop: false,
//                     timer: 1000,
//                     timerProgressBar: true,
//                     showConfirmButton: false
//                 });

//             }
//         } catch (error) {
//             console.error(error)
//             Swal.fire({
//                 text: "Network Error!",
//                 icon: "error",
//                 backdrop: false,
//                 timer: 1000,
//                 timerProgressBar: true,
//                 showConfirmButton: false
//             });
//         }
//     })
// })


document.addEventListener("DOMContentLoaded", () => {
    const topicInput = document.getElementById("taskTopic");
    const topicBtn = document.getElementById("topicBtn");
    const topicsList = document.getElementById("topics");
    const token = localStorage.getItem("token");
  
    // ✅ Fetch topics from backend
    async function fetchTopics() {
      topicsList.innerHTML = `<li class="empty-state"><p>Loading topics...</p></li>`;
      try {
        const response = await fetch("http://localhost:3000/api/getTopicsName", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch topics");
        const result = await response.json();
        renderTopics(result.data);
        return result.data; // 🔑 Return topics for reuse
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch topics. Please try again later.",
          backdrop: false,
          timer: 1500,
          showConfirmButton: false,
        });
        topicsList.innerHTML = `
          <li class="empty-state">
            <h3>Couldn’t load topics</h3>
            <p>Please refresh or try again later</p>
          </li>`;
        return [];
      }
    }
  
    // ✅ Render topics with actions
    function renderTopics(topics) {
      topicsList.innerHTML = "";
      if (!topics || topics.length === 0) {
        topicsList.innerHTML = `
          <li class="empty-state">
            <h3>No topics yet</h3>
            <p>Create your first topic to get started</p>
            <button onclick="document.getElementById('taskTopic').focus()">+ Create Topic</button>
          </li>`;
        return;
      }
  
      topics.forEach((topic) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${topic.topicName}</span>
          <div class="topic-actions">
            <button onclick="openTopic('${topic._id}', '${topic.topicName}')">➡️ Open</button>
          </div>`;
        topicsList.appendChild(li);
      });
    }
  
    // ✅ Handle Create Button
    topicBtn.addEventListener("click", async () => {
      const topicValue = topicInput.value.trim();
      if (!topicValue) {
        Swal.fire("Oops!", "Topic name cannot be empty.", "error");
        return;
      }
  
      try {
        const topics = await fetchTopics();
        const existing = topics.find(
          (t) => t.topicName.toLowerCase() === topicValue.toLowerCase()
        );
  
        if (existing) {
          // 🔑 Topic exists → just open it
          localStorage.setItem("taskTopic", existing.topicName);
          localStorage.setItem("taskTopicId", existing._id);
          Swal.fire({
            text: "Opening existing topic...",
            icon: "info",
            backdrop: false,
            timer: 1000,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "../../../index.html"; // ✅ redirect to list page
          });
        } else {
          // 🔑 New topic → create it
          const response = await fetch("http://localhost:3000/api/createTaskTopic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topicValue, token }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            localStorage.setItem("taskToken", data.taskToken);
            localStorage.setItem("taskTopic", topicValue);
            localStorage.setItem("taskTopicId", data._id);
  
            Swal.fire({
              text: "New topic created!",
              icon: "success",
              backdrop: false,
              timer: 1000,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = "../../../index.html"; // ✅ fresh redirect
            });
          } else {
            Swal.fire({
              text: data.message || "Error while creating topic!",
              icon: "error",
              backdrop: false,
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          text: "Network Error!",
          icon: "error",
          backdrop: false,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  
    // ✅ Open existing topic directly from list
    window.openTopic = (id, name) => {
      localStorage.setItem("taskTopic", name);
      localStorage.setItem("taskTopicId", id);
      window.location.href = "../../../index.html";
    };
  
    // Initial load
    fetchTopics();
  });
  