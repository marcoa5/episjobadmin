import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core'
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/messaging'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { LogoutComponent } from './comp/util/logout/logout.component';
import { AuthServiceService } from './serv/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'episjobadmin';
  userN:string='';
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
  spin:boolean=true
  subsList:Subscription[]=[]

  constructor(private dialog:MatDialog, public router: Router, public auth :AuthServiceService){
  }
  
  ngOnInit(){
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a[0]=='loading'){

        }else if(a[0]=='login'){
          this.spin=false
          this.userN='login'
          this.userT=''
          this.nome = ''
          this.cognome = ''
          this.userId=''
          this.SJ = ''
          this.Visit=''
          this.Newrig=''
        }else if(a.Nome){
          this.userN = a.Nome.substring(0,1) + a.Cognome.substring(0,1)
          this.spin=false
          this.userT=a.Pos
          this.nome = a.Nome
          this.cognome = a.Cognome
          this.userId=a.uid
          this.SJ = a._sj
          this.Visit=a._visit
          this.Newrig=a._newrig
          firebase.database().ref('Notif').child(this.userId).on('value',a=>{
            this.not=0
            a.forEach(b=>{
              if(b.val().status==0) this.not++
            })
          })
        }
      })
    )
    this.onResize()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
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
