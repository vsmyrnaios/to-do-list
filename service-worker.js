// service-worker.js

self.addEventListener("push", function (event) {
  const data = event.data.json();

  const options = {
    body: data.message,
    icon: "https://cdn-icons-png.flaticon.com/128/272/272340.png", // Αντικατάστησε με τη διαδρομή του εικονιδίου της ειδοποίησης
    badge: "path/to/badge.png", // Αντικατάστησε με τη διαδρομή του εικονιδίου badge
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
