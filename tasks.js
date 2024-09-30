document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskTime = document.getElementById("taskTime");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskList = document.getElementById("taskList");
  const container = document.querySelector(".container");
  const notification = document.getElementById("notification");
  const settingsButton = document.getElementById("settings");
  const settingsMenu = document.getElementById("settingsMenu");
  const taskPriority = document.getElementById("priority");
  const closeBtn = document.querySelector(".close-btn");
  const taskIcon = document.getElementById("task-icon");
  const xButton = document.getElementById("closeButton");
  const noteIcon = document.getElementById("note-icon");
  const timerIcon = document.getElementById("time-icon");

  // Φορτώνει τα αποθηκευμένα tasks από το localStorage
  loadTasks();
  applySavedTheme();

  function showNotification(taskText) {
    // Εμφάνιση ειδοποίησης με νέα δεδομένα
    notification.innerHTML = `
      <div class="icon-container">
        <span class="material-icons">warning</span>
      </div>
      <div class="message">Time to start: ${taskText}</div>
      <div class="close-btn">&times;</div>
    `;

    notification.classList.remove("hidden");
    notification.classList.add("visible");

    // Κουμπί κλεισίματος
    closeBtn.addEventListener("click", function () {
      notification.classList.remove("visible");
      notification.classList.add("hidden");
    });

    // Αυτόματη απόκρυψη μετά από 10 δευτερόλεπτα
    setTimeout(function () {
      notification.classList.remove("visible");
      notification.classList.add("hidden");
    }, 10000);
  }

  function checkTaskTimes() {
    const now = new Date();
    taskList.querySelectorAll("li").forEach(function (li) {
      if (li.classList.contains("completed")) return;

      const taskText = li.querySelector(".task-text").textContent;
      const taskDateString = taskText.match(/\d{4}-\d{2}-\d{2}/)[0];
      const taskTimeString = taskText.match(/\d{2}:\d{2}/)[0];
      const taskDateTimeString = `${taskDateString} ${taskTimeString}`; // Χρήση backticks
      const taskDateTime = new Date(taskDateTimeString);

      // Έλεγχος αν η τρέχουσα ημερομηνία και ώρα είναι ίση με την ημερομηνία και ώρα του task
      if (
        now.toDateString() === taskDateTime.toDateString() &&
        now.getHours() === taskDateTime.getHours() &&
        now.getMinutes() === taskDateTime.getMinutes()
      ) {
        showNotification(taskText);
      }
    });
  }

  // Έλεγχος των tasks κάθε λεπτό
  setInterval(checkTaskTimes, 15000);

  function addTask() {
    const taskText = taskInput.value.trim();
    const dateText = taskDate.value;
    const timeText = taskTime.value;

    if (taskText === "" || dateText === "" || timeText === "") {
      if (taskText === "") {
        taskInput.placeholder = "Please enter a task!";
        taskInput.classList.add("error");
      }
      if (dateText === "") {
        taskDate.classList.add("error");
      }
      if (timeText === "") {
        taskTime.classList.add("error");
      }
      return;
    }

    const priorityValue = taskPriority.value;
    let priorityIcon = "south_east";
    if (priorityValue === "medium") {
      priorityIcon = "east";
    } else if (priorityValue === "high") {
      priorityIcon = "call_made";
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="priority"> <i class="material-icons icon-large">${priorityIcon}</i></span>
      <span class="task-text"><b>${taskText}</b> (<i>${dateText}</i>, <i>${timeText}</i>)</span>
      <button class="complete-btn">✔️</button>
      <button class="delete-btn">❌</button>
      <button class="trash-btn" style="display: none;">🗑️</button>
    `;

    li.querySelector(".complete-btn").addEventListener("click", function () {
      li.classList.toggle("completed");
      updateTaskDisplay(li);
      saveTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", function () {
      taskList.removeChild(li);
      saveTasks();
    });

    li.querySelector(".trash-btn").addEventListener("click", function () {
      taskList.removeChild(li);
      saveTasks();
    });

    taskList.appendChild(li);
    saveTasks();

    // Scroll to the latest task
    li.scrollIntoView({ behavior: "smooth", block: "end" });

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    taskPriority.value = "low";
    taskInput.placeholder = "Add a new task...";
    taskInput.classList.remove("error");
    taskDate.classList.remove("error");
    taskTime.classList.remove("error");
  }

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(function (li) {
      tasks.push({
        text: li.querySelector(".task-text").innerHTML,
        priority: li.querySelector(".priority i").innerText,
        completed: li.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      JSON.parse(savedTasks).forEach(function (task) {
        let priorityIcon = "south_east"; // Default icon for low priority
        if (task.priority === "east") {
          priorityIcon = "east";
        } else if (task.priority === "call_made") {
          priorityIcon = "call_made";
        }

        const li = document.createElement("li");
        li.innerHTML = `
          <span class="priority"> <i class="material-icons icon-large">${priorityIcon}</i></span>
          <span class="task-text">${task.text}</span>
          <button class="complete-btn" style="display: ${
            task.completed ? "none" : "inline-block"
          }">✔️</button>
          <button class="delete-btn" style="display: ${
            task.completed ? "none" : "inline-block"
          }">❌</button>
          <button class="trash-btn" style="display: ${
            task.completed ? "inline-block" : "none"
          };">🗑️</button>
        `;

        if (task.completed) {
          li.classList.add("completed");
        }
        taskList.appendChild(li);

        li.querySelector(".complete-btn").addEventListener(
          "click",
          function () {
            li.classList.toggle("completed");
            updateTaskDisplay(li);
            saveTasks();
          }
        );

        li.querySelector(".delete-btn").addEventListener("click", function () {
          taskList.removeChild(li);
          saveTasks();
        });

        li.querySelector(".trash-btn").addEventListener("click", function () {
          taskList.removeChild(li);
          saveTasks();
        });
      });
    }
  }

  function updateTaskDisplay(li) {
    const completeBtn = li.querySelector(".complete-btn");
    const deleteBtn = li.querySelector(".delete-btn");
    const trashBtn = li.querySelector(".trash-btn");

    if (li.classList.contains("completed")) {
      if (completeBtn) completeBtn.style.display = "none";
      if (deleteBtn) deleteBtn.style.display = "none";
      if (trashBtn) trashBtn.style.display = "inline-block";
    } else {
      if (completeBtn) completeBtn.style.display = "inline-block";
      if (deleteBtn) deleteBtn.style.display = "inline-block";
      if (trashBtn) trashBtn.style.display = "none";
    }
  }

  taskInput.addEventListener("input", function () {
    taskInput.classList.remove("error");
  });

  taskDate.addEventListener("input", function () {
    taskDate.classList.remove("error");
  });

  taskTime.addEventListener("input", function () {
    taskTime.classList.remove("error");
  });

  addTaskButton.addEventListener("click", addTask);

  function applyTheme(theme) {
    console.log(`Applying theme: ${theme}`);
    const container = document.querySelector(".container");
    container.classList.remove(
      "theme-default",
      "theme-dark",
      "theme-colorful",
      "theme-elegant"
    );
    container.classList.add(theme);

    // Αποθήκευση του επιλεγμένου θέματος στο localStorage
    localStorage.setItem("theme", theme);
  }

  function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }

  // Εγγραφή του event listener για τα κουμπιά ρυθμίσεων
  const settingsOptions = document.querySelectorAll(".settings-option");
  settingsOptions.forEach((button) => {
    button.addEventListener("click", function () {
      const theme = this.getAttribute("data-theme");
      applyTheme(theme);
    });
  });

  // Toggle settings menu
  settingsButton.addEventListener("click", function () {
    settingsMenu.classList.toggle("hidden");
    settingsButton.classList.toggle("rotated");
  });

  // Συνάρτηση για το taskIcon
  function toggleContainer() {
    settingsMenu.classList.add("hidden");
    const isVisible = container.classList.contains("visible");
    // Εναλλαγή της ορατότητας του container
    container.classList.toggle("hidden", isVisible);
    container.classList.toggle("visible", !isVisible);

    if (container.classList.contains("visible")) {
      settingsButton.classList.remove("hidden");
    } else {
      settingsButton.classList.add("hidden");
    }
  }

  // Εγγραφή του event listener για το taskIcon
  taskIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Stop click from propagating to document
    toggleContainer();
  });

  noteIcon.addEventListener("click", function () {
    window.location.href = "index5.html";
  });

  timerIcon.addEventListener("click", function () {
    window.location.href = "index4.html";
  });

  // Εγγραφή του event listener για το κουμπί κλεισίματος (Χ)
  xButton.addEventListener("click", function () {
    container.classList.add("hidden");
    container.classList.remove("visible");
  });
});
