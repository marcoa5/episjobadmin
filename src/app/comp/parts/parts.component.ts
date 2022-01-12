import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SavevisitComponent } from '../util/dialog/savevisit/savevisit.component';
import { NewpartsrequestComponent } from './newpartsrequest/newpartsrequest.component';
import { MakeidService } from '../../serv/makeid.service'
import firebase from 'firebase/app';
import 'firebase/database'
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
  selector: 'episjob-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  info:any|undefined
  userId:string=''
  reqId:string=''
  list:any[]=[]
  listId:number=-1
  partList: any[]=[]
  pos:string=''
  allow:boolean=false
  allSpin:boolean=true
  subsList:Subscription[]=[]

  constructor(public clipboard: Clipboard, private http: HttpClient, public dialog: MatDialog, public router: Router, public makeid: MakeidService, public route: ActivatedRoute, public auth:AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.userId=a.uid
        setTimeout(() => {
          this.allow=this.auth.allow('parts')
          this.allSpin=false
          if(this.allow==true){
            this.loadlist()
          }
        }, 1);
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadlist(){
    if(this.pos=='SU' || this.pos=='admin' || this.pos=='adminS'){
      firebase.database().ref('PartReq').on('value',b=>{
        this.list=[]
        b.forEach(c=>{
          c.forEach(d=>{
            this.list.push(d.val())
          })
          
        })
      })
    } else if(this.pos=='tech'){
      firebase.database().ref('PartReq').child(this.userId).on('value',b=>{
        this.list=[]
        b.forEach(c=>{
          if(c.val().usedId==this.userId) this.list.push(c.val())
        })
      })
    }
  }


  start(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    this.info=undefined
    const dialogRef = this.dialog.open(NewpartsrequestComponent, {
      data: {info: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        this.info=result
        this.reqId=this.makeid.makeId(5)
        this.info['reqId']=this.reqId
        this.info['usedId']=this.userId
        firebase.database().ref('PartReq').child(this.userId).child(this.reqId).set(this.info)
      }
    })
  }

  submit(e:any[]){
    if(this.pos=='customer'){
      let list:string=''
      e.forEach(a=>{
        if(list!='') list += `\n${a.pn}\t${a.qty}`
      })
      this.clipboard.copy(list)
      window.open('https://shoponline.epiroc.com/Quote/AddItemsExcel')
    } else {
      const dialegRef= this.dialog.open(SavevisitComponent)
      dialegRef.afterClosed().subscribe(res=>{
        if(res!=undefined){
          let params = new HttpParams()
          .set("info",JSON.stringify(this.info))
          let url:string = 'https://episjobreq.herokuapp.com/parts/'
          this.http.get(url,{params:params}).subscribe(a=>{
            alert('submitted')
          })
          //this.router.navigate([''])
        }
      })
    }
  }

  saveList(e:any){
    this.info['Parts']= e
    firebase.database().ref('PartReq').child(this.info.usedId).child(this.reqId).set(this.info)
    this.loadlist()
  }

  infoRig(){
    if(this.info!=undefined && window.innerWidth>550){
      return ` for ${this.info.model} (${this.info.sn})`
    } else if(this.info!=undefined && window.innerWidth>350){
      return ` for ${this.info.sn}`
    } else {
      return ''
    }
    
  }

  ind(e:any){
    this.listId=e
  }

  open(){
    this.info=this.list[this.listId]
    this.reqId=this.list[this.listId].reqId
    this.partList=this.list[this.listId].Parts
  }

  openD(a:number){
    this.info=this.list[a]
    this.reqId=this.list[a].reqId
    this.partList=this.list[a].Parts
  }

  delete(){
    this.reqId=this.list[this.listId].reqId
    const dialogRef = this.dialog.open(DeldialogComponent, {data: {name:'Request for ' + this.list[this.listId].sn}})
    dialogRef.afterClosed().subscribe(res=>{
      if(res!=undefined){
        firebase.database().ref('PartReq').child(this.userId).child(this.reqId).remove()
      }
    })
    this.listId=-1
  }

  clear(){
    this.info=undefined
    this.reqId=''
    this.listId=-1
  }
}
