import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SavevisitComponent } from '../util/dialog/savevisit/savevisit.component';
import { NewpartsrequestComponent } from './newpartsrequest/newpartsrequest.component';
import { MakeidService } from '../../serv/makeid.service'
import firebase from 'firebase/app';
import 'firebase/database'
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';

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
  auth:string[]=[]
  allSpin:boolean=true
  constructor(public dialog: MatDialog, public router: Router, public makeid: MakeidService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(a=>this.auth=a.auth.split(','))
    firebase.auth().onAuthStateChanged(a=>{
      if(a!=null) {
        firebase.database().ref('Users').child(a.uid).child('Pos').once('value',g=>{
          this.pos=g.val()
          if(this.auth.includes(this.pos)) this.allow=true
        })
        .then(()=>{
          this.allSpin=false
          this.userId=a.uid
          if(this.pos=='SU' || this.pos=='admin' || this.pos=='adminS'){
            firebase.database().ref('PartReq').child(a.uid).on('value',b=>{
              this.list=Object.values(b.val())
            })
          } else if(this.pos=='tech'){
            firebase.database().ref('PartReq').child(a.uid).on('value',b=>{
              b.forEach(c=>{
                if(c.val().usedId==this.userId) this.list.push(c.val())
              })
            })
          }
        })
      }

    })
  
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

  submit(e:any){
    console.log(this.info, e)
    const dialegRef= this.dialog.open(SavevisitComponent)
    dialegRef.afterClosed().subscribe(res=>{
      if(res!=undefined){
        alert('submitted')
        this.router.navigate([''])
      }
    })
  }

  saveList(e:any){
    this.info['Parts']= e
    firebase.database().ref('PartReq').child(this.userId).child(this.reqId).set(this.info)
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
