import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SavevisitComponent } from '../util/dialog/savevisit/savevisit.component';
import { NewpartsrequestComponent } from './newpartsrequest/newpartsrequest.component';
import { MakeidService } from '../../serv/makeid.service'
import firebase from 'firebase/app';
import 'firebase/database'
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Clipboard } from '@angular/cdk/clipboard'
import * as moment from 'moment'
import { SubmitvisitComponent } from '../util/dialog/submitvisit/submitvisit.component';
import { GetquarterService } from 'src/app/serv/getquarter.service';
import { GenericComponent } from '../util/dialog/generic/generic.component';

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
  listSent:any[]=[]
  _listSent:any[]=[]
  listId:number=-1
  partList: any[]=[]
  pos:string=''
  chDel:boolean=false
  allow:boolean=false
  allSpin:boolean=true
  userReqId:string='none'
  search:string=''
  spin:boolean=false
  subsList:Subscription[]=[]


  constructor(private q:GetquarterService , public clipboard: Clipboard, private http: HttpClient, public dialog: MatDialog, public router: Router, public makeid: MakeidService, public route: ActivatedRoute, public auth:AuthServiceService) { }

  //@ViewChild('search') search!: ElementRef

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.userId=a.uid
        setTimeout(() => {
          this.allow=this.auth.allow('parts',this.pos)
          this.allSpin=false
          if(this.allow==true){
            this.loadlist()
            this.loadsent()
          }
        }, 1);
      })
    )
  }

  ngOnChanges(){
    
  }

  sea(e:any){
    this.listSent=this._listSent.filter(r=>{
      return (
        r.sn.toLowerCase().includes(e.toLowerCase()) ||
        r.customer.toLowerCase().includes(e.toLowerCase()) ||
        r.author.toLowerCase().includes(e.toLowerCase()) ||
        r.model.toLowerCase().includes(e.toLowerCase()) ||
        r.orig.toLowerCase().includes(e.toLowerCase()) ||
        r.type.toLowerCase().includes(e.toLowerCase())
      )
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadlist(){
    if(this.pos=='SU' || this.pos=='admin' || this.pos=='adminS'||this.pos=='tech'){
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

  loadsent(){
    this.spin=true
    if(this.pos=='SU'){
      firebase.database().ref('PartReqSent').on('value',b=>{
        this._listSent=[]
        b.forEach(c=>{
          c.forEach(d=>{
            let g = d.val()
            g.sel=0
            this._listSent.push(g)
            this.listSent=this._listSent
            this.spin=false
          })
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
        //firebase.database().ref('PartReq').child(this.userId).child(this.reqId).set(this.info)
        this.partList=[]
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
      //window.open('https://shoponline.epiroc.com/Quote/AddItemsExcel')
    } else {
      let shipTo:any=''
      firebase.database().ref('shipTo').child(this.info.sn).once('value',a=>{
        if(a.val()!=null){
          shipTo={
            cont: a.val().cont?Object.values(a.val().cont):'',
            address: a.val().address?a.val().address:'',
            cig: a.val().cig?a.val().cig:'',
            cup: a.val().cup?a.val().cup:''
          }
        }
      })
      .then(()=>{
        this.info['shipTo']=shipTo?shipTo:''
        this.info['date']=moment(new Date()).format('YYYY-MM-DD')
        const dialegRef= this.dialog.open(SubmitvisitComponent, {data: this.info})
        dialegRef.afterClosed().subscribe(res=>{
          if(res!=undefined){
            let params = new HttpParams()
            .set("info",JSON.stringify(this.info))
            //let url:string = 'https://episjobreq.herokuapp.com/partreq'
            let url:string = '/api/'
            const wait = this.dialog.open(GenericComponent, {data:{msg:'Sending....'}})
            this.http.get(url,{params:params}).subscribe((a: any)=>{
              if(a){
                firebase.database().ref('PartReqSent').child(this.info.sn).child(this.info.reqId).set(this.info)
                .then(()=>firebase.database().ref('PartReq').child(this.info.usedId).child(this.info.reqId).remove()
                .then(()=>{
                  wait.close()
                  this.clear()
                  console.log('SENT ' + a)
                })
                )
              }
            })
          }
        })
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
    if(e!='-1'){
      if(this.pos=='SU') this.userReqId=e[1].usedId
      this.listId=parseInt(e[0])
      firebase.database().ref('PartReq').child(this.userReqId).child(e[1].reqId).once('value',a=>{
        if(a.val()==null) {
          this.chDel=true
        } else{
          this.chDel=false
        }
      })
    } else{
      this.listId=-1
    }
    
  }

  open(){
    this.info=this.list[this.listId]
    this.reqId=this.list[this.listId].reqId
    this.partList=this.list[this.listId].Parts
  }

  openSent(a:number){
    this.info=this.listSent[a]
    this.reqId=this.listSent[a].reqId
    this.partList=this.listSent[a].Parts
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
        firebase.database().ref('PartReq').child(this.userReqId).child(this.reqId).remove()
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
