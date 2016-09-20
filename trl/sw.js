self.addEventListener('push', function(event) {  
  var notificationTitle = 'Nuevo Mensaje TRL';
  const notificationOptions = {
    body: 'Notificiación de asignacion de servicio.',
    icon: './images/destino.png',
    tag: 'notificación',
    data: {
      url: 'http://trl.taxiradioreloj.com'
    }
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(
        notificationTitle, notificationOptions)
    ])
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var clickResponsePromise = Promise.resolve();
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url);
  }

  event.waitUntil(
    Promise.all([
      clickResponsePromise
    ])
  );
});