import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/messaging'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { LogoutComponent } from './comp/util/logout/logout.component';

const firebaseConfig = {
  apiKey: "AIzaSyBtO5C1bOO70EL0IPPO-BDjJ40Kb03erj4",
  authDomain: "epi-serv-job.firebaseapp.com",
  databaseURL: "https://epi-serv-job-default-rtdb.firebaseio.com",
  projectId: "epi-serv-job",
  storageBucket: "epi-serv-job.appspot.com",
  messagingSenderId: "793133030101",
  appId: "1:793133030101:web:1c046e5fcb02b42353a05c",
  measurementId: "G-Y0638WJK1X"
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'episjobadmin';
  userN:string | undefined;
  userT:string |undefined;
  orient: boolean | undefined
  titolo: string | undefined
  showFiller:boolean=false;
  nome:string = ''
  cognome:string = ''
  screenSize:boolean=true
  constructor(private dialog:MatDialog){}
  
  ngOnInit(){
    firebase.initializeApp(firebaseConfig)
    this.onResize()
    firebase.auth().onAuthStateChanged(a=>{
      if(!a) {
        this.userN = 'null'
      } else {
        firebase.database().ref('Users/' + a.uid). once('value',s=>{
          this.userN = s.val().Nome.substring(0,1) + s.val().Cognome.substring(0,1)
          this.userT=s.val().Pos
          this.nome = s.val().Nome
          this.cognome = s.val().Cognome
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerHeight<window.innerWidth){
      this.orient=true
    } else {
      this.orient = false
    }

    if(window.innerWidth>500) {
      this.screenSize =true
    } else {
      this.screenSize =false
    }
  }
  userName(a:any){
    this.userN=a
  }

  logout(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(LogoutComponent, {
      data: {name: this.nome}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) firebase.auth().signOut()
    })
  }

  userExists(){
    if(this.userN && this.userN!='null') return true
    return false 
  }
}
