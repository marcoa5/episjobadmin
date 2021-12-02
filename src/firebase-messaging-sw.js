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
  var url=''
  self.addEventListener('notificationclick', function(event) {
    event.notification.close()
    var promise=new Promise(function(resolve){
      setTimeout(resolve,500)
    }).then(function(){
      clients.openWindow('https://episjobadmin.web.app/' + url)
    })
    event.waitUntil(promise)
  })

  if (firebase.messaging.isSupported()){
    const messaging = firebase.messaging()
    
    messaging.onBackgroundMessage((payload) => {
      url=payload.data.url
      console.log('Received background message ', payload.data.title);
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        badge: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
        icon: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
        //tag: payload.data.title.substring(0,9)=='New Visit'? 'visit' : 'sj',
        //requireInteraction: true
      };      
      
      return self.registration.showNotification(notificationTitle, notificationOptions);
    })

    
  }
  
    

  