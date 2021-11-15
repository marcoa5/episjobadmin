importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBtO5C1bOO70EL0IPPO-BDjJ40Kb03erj4",
    authDomain: "epi-serv-job.firebaseapp.com",
    databaseURL: "https://epi-serv-job-default-rtdb.firebaseio.com",
    projectId: "epi-serv-job",
    storageBucket: "epi-serv-job.appspot.com",
    messagingSenderId: "793133030101",
    appId: "1:793133030101:web:1c046e5fcb02b42353a05c",
    measurementId: "G-Y0638WJK1X"
  });

  const messaging = firebase.messaging()

  try{
    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message ', payload);
      const notificationTitle = payload.data.score;
      const notificationOptions = {
        body: payload.data.time,
        badge: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
        icon: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
      };
    
      self.registration.showNotification(notificationTitle, notificationOptions)
      self.addEventListener('notificationclick', function(event) {  
        event.notification.close();
        clients.openWindow('./files')
      }, false);
      })
    }
  catch (a){
    console.log('Errore')
  }
  