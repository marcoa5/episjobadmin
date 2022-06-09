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
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar'
import { CustomsnackComponent } from './comp/util/customsnack/customsnack.component';
import { NotificationListComponent } from './comp/notification-list/notification-list.component';
import {MatPaginatorIntl} from '@angular/material/paginator'
import { SwupdateService } from './serv/swupdate.service';
import {environment} from '../environments/environment';

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
  chName:boolean=false
  pos:string=''
  size:boolean=true
  version:string=''
  subsList:Subscription[]=[]

  constructor(private dialog:MatDialog, public router: Router, public auth :AuthServiceService, private snack: MatSnackBar, private pag:MatPaginatorIntl, private swu: SwupdateService){
    //this.swu.showAppUpdateAlert()
  }
  
  ngOnInit(){
    this.version=environment.appVersion
    console.log(this.version)
    this.pag.itemsPerPageLabel='#'
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
          this.pos=''
        }else if(a.Nome){
          this.userN = a.Nome.substring(0,1) + a.Cognome.substring(0,1)
          this.spin=false
          this.userT=a.Pos
          this.nome = a.Nome
          this.cognome = a.Cognome
          this.userId=a.uid
          this.SJ = a._sj
          this.Visit=a._visit
          this.pos=a.Pos
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
    this.onResize().then(()=>this.chName=true)
    let messaging:any
    try{
      if(firebase.messaging.isSupported()){
        messaging = firebase.messaging()
        messaging.onMessage((p:any) => {
          this.snack.openFromComponent(CustomsnackComponent,{data:p})
        })
      }
    } catch {
      console.log('network errror')
    }

    let tokens:any[]=[]
    if(messaging!=undefined){
      try{
        messaging.getToken({vapidKey:'BETaY1oMq6ONzg-9B-uNHl27r4hcKd5UVH-EgNEXLQ9kUzqDwGq8nZwZTDN0klxbC-Oz-nSz6yGTzDD0R4h_vXY'})
      .then((t:any)=>{
        firebase.database().ref('Tokens').child(this.userId).child(t).set({
          token: t,
          pos: this.pos,
          name: this.nome,
          date: moment(new Date()).format('YYYY-MM-DD - HH:mm:ss'),
          id:this.userId,
        })
      })
      .catch((err: any)=>{})
      } catch{

      }
    }
    
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    return new Promise(res=>{
      setTimeout(() => {
        if(window.innerHeight<window.innerWidth){
          this.orient=true
          res('')
        } else {
          this.orient = false
          res('')
        }
        if(window.innerWidth>500) {
          this.screenSize =true
          res('')
        } else {
          this.screenSize =false
          res('')
        }
      }, 1)
    })
  }
  /*userName(a:any){
    this.userN=a
  }*/

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

  navNot(){
    //this.router.navigate(['notif'])
    this.dialog.open(NotificationListComponent, {panelClass: 'not-dialog'})
  }

  chHome(){
    if(this.router.url.split(';')[0]=='/') return true
    return false
  }

  goTo(a:string){
    this.router.navigate([a])
  }

  chPos(a:string):boolean{
    return this.auth.acc(a)
  }
  
}
