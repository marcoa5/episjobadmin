import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core'
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/messaging'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { LogoutComponent } from './comp/util/logout/logout.component';
import { AuthServiceService } from './serv/auth-service.service';

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
  userId:string=''
  SJ:any
  Visit:any
  Newrig:any
  not:number=0

  constructor(private dialog:MatDialog, public router: Router, auth :AuthServiceService){
    auth.getFleetData()
    auth.getCustData()
  }
  
  ngOnInit(){
    this.onResize()
    firebase.auth().onAuthStateChanged(a=>{
      if(!a) {
        this.userN = 'null'
      } else {
        firebase.database().ref('Users/' + a.uid).once('value',s=>{
          this.userN = s.val().Nome.substring(0,1) + s.val().Cognome.substring(0,1)
          this.userT=s.val().Pos
          this.nome = s.val().Nome
          this.cognome = s.val().Cognome
          this.userId= s.key? s.key:''
          this.SJ = s.val().sj
          this.Visit=s.val().visit
          this.Newrig=s.val().newrig
          firebase.database().ref('Notif').child(this.userId).on('value',a=>{
            this.not=0
            a.forEach(b=>{
              if(b.val().status==0) this.not++
            })
          })
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
    let info = {
      id: this.userId,
      pos: this.userT,
      SJ: this.SJ,
      Visit: this.Visit,
      Newrig: this.Newrig
    }
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(LogoutComponent, {
      data: info
    });
  }

  userExists(){
    if(this.userN && this.userN!='null') return true
    return false 
  }

  navNot(){
    this.router.navigate(['notif'])
  }

  
}
