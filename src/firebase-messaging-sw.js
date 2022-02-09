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
  var url=''
  self.addEventListener('notificationclick', function(event) {
    event.notification.close()
    var promise=new Promise(function(resolve){
      setTimeout(resolve,500)
    }).then(function(){
      clients.openWindow('./' + url)
    })
    event.waitUntil(promise)
  })

  if (firebase.messaging.isSupported()){
    messaging.onBackgroundMessage((payload) => {
      if(payload.data.type=='general'){
        url = 'notif'
        const notificationTitle = (payload.data.count=='1'? '1 new notification' : payload.data.count + ' new notifications');
        const notificationOptions = {
          body: payload.data.text,
          badge: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
          icon: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
          tag: 'not',
          requireInteraction: true
        };      
        self.registration.showNotification(notificationTitle, notificationOptions)
      }

      if(payload.data.type=='sj'){
        url='files'
        const notificationTitle = 'New Service Job';
        const notificationOptions = {
        body: payload.data.info,
          badge: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
          icon: 'https://raw.githubusercontent.com/marcoa5/episjobadmin/master/src/assets/icons/logo.png',
          //tag: payload.data.title.substring(0,9)=='New Visit'? 'visit' : 'sj',
          requireInteraction: true
        };      
      return self.registration.showNotification(notificationTitle, notificationOptions)
      }
      
    })

    
  }
  
    

  