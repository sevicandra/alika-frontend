self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    image: data.image,
    vibrate: data.vibrate,
    actions: data.actions,
    url: data.url,
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  if (event.action === "open") {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else if (event.action === "dismiss") {
  } else {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
