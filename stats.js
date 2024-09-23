document.addEventListener("DOMContentLoaded", function () {
  // Load tasks from localStorage
  const loadTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  };

  // Generate statistics
  const generateStatistics = (tasks) => {
    const stats = {
      completed: 0,
      incomplete: 0,
      priorities: {
        low: 0,
        medium: 0,
        high: 0,
      },
      completedTasks: {
        // Προσθήκη για completed tasks ανά προτεραιότητα
        low: 0,
        medium: 0,
        high: 0,
      },
    };

    tasks.forEach((task) => {
      if (task.completed) {
        stats.completed += 1;

        // Κατανομή ολοκληρωμένων tasks ανά προτεραιότητα
        if (task.priority === "south_east") {
          stats.completedTasks.low += 1;
        } else if (task.priority === "east") {
          stats.completedTasks.medium += 1;
        } else if (task.priority === "call_made") {
          stats.completedTasks.high += 1;
        }
      } else {
        stats.incomplete += 1;
      }

      // Κατανομή προτεραιοτήτων συνολικά
      if (task.priority === "south_east") {
        stats.priorities.low += 1;
      } else if (task.priority === "east") {
        stats.priorities.medium += 1;
      } else if (task.priority === "call_made") {
        stats.priorities.high += 1;
      }
    });

    return stats;
  };

  // Create charts
  const createCharts = (stats) => {
    const ctxCompletion = document
      .getElementById("taskCompletionChart")
      .getContext("2d");
    const ctxPriority = document
      .getElementById("taskPriorityChart")
      .getContext("2d");
    const ctxcompletedByPriority = document
      .getElementById("completedTaskRank")
      .getContext("2d");

    // Task Completion Chart
    new Chart(ctxCompletion, {
      type: "pie",
      data: {
        labels: ["Completed", "Incomplete"],
        datasets: [
          {
            data: [stats.completed, stats.incomplete],
            backgroundColor: ["#00BCD4", "#9C27B0 "],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Task Completion Status",
            font: {
              size: 16,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 20,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.raw + " tasks";
              },
            },
          },
        },
      },
    });

    // Task Priority Chart
    new Chart(ctxPriority, {
      type: "bar",
      data: {
        labels: ["Low", "Medium", "High"],
        datasets: [
          {
            data: [
              stats.priorities.low,
              stats.priorities.medium,
              stats.priorities.high,
            ],
            backgroundColor: [" #00BCD4 ", "#03A9F4", "#0288D1"],
            borderColor: [" #00BCD4 ", "#03A9F4", "#0288D1"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Task Rank Distribution",
            font: {
              size: 16,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.raw + " tasks";
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    // Completed Tasks Pie Chart by Priority
    new Chart(ctxcompletedByPriority, {
      type: "pie",
      data: {
        labels: ["Low", "Medium", "High"],
        datasets: [
          {
            label: "Completed Tasks by Priority",
            data: [
              stats.completedTasks.low,
              stats.completedTasks.medium,
              stats.completedTasks.high,
            ],
            backgroundColor: [" #00BCD4 ", "#03A9F4", "#0288D1"],
            borderColor: [" #00BCD4 ", "#03A9F4", "#0288D1"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Completed Tasks by Priority",
            font: {
              size: 16,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            display: true, // Εμφάνιση των labels
            position: "bottom", // Τοποθέτηση κάτω από το γράφημα
            labels: {
              boxWidth: 20, // Ρύθμιση μεγέθους τετραγώνων των labels
              padding: 15, // Ενδιάμεσο padding ανάμεσα στα labels
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                return `${label}: ${value} tasks`;
              },
            },
          },
        },
      },
    });
  };

  // Main function
  const tasks = loadTasks();
  const stats = generateStatistics(tasks);
  createCharts(stats);
});
