var token;

Notification.requestPermission().then(function(permission) {
    if(permission === 'granted' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(initialiseState);	
    } else {
            console.log('service worker not present');
    }
});                            		                              

function initialiseState() {

    //check if notification is supported or not
    if(!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('Notificaiton are not supported');
            return;
    }
    //check if user has blocked push notification
    if(Notification.permission === 'denied'){
            console.warn('User has blocked the notification');
    }
    //check if push messaging is supported or not
    if(!('PushManager' in window)) {
            console.warn('Push messaging is not supported');
            return;
    }

    //subscribe to GCM
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            //call subscribe method on serviceWorkerRegistration object
            serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
                    .then(function(subscription){
                    getToken(subscription);
            }).catch(function(err){
                    console.error('Error occured while subscribe(): ', err);
            });
    });
}

function getToken(subscription) {     
    console.log(subscription);
    token = subscription.endpoint.substring(40, subscription.endpoint.length);			
}
