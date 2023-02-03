import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table';
import firebase from 'firebase/app'
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { ActivatedRoute, Router } from '@angular/router'
import { InputhrsComponent } from '../../util/dialog/inputhrs/inputhrs.component';
import { ImportpartsComponent } from '../../util/dialog/importparts/importparts.component';
import * as moment from 'moment'
import { GetquarterService } from 'src/app/serv/getquarter.service';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard'
import { SubmitvisitComponent } from '../../util/dialog/submitvisit/submitvisit.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericComponent } from '../../util/dialog/generic/generic.component';
import { Location } from '@angular/common';
import { SavedialogComponent } from '../../util/dialog/savedialog/savedialog.component';
import 'moment-timezone'

export interface el{
  pn: string
  desc: string
  qty: number
}
@Component({
  selector: 'episjob-requestlist',
  templateUrl: './requestlist.component.html',
  styleUrls: ['./requestlist.component.scss']
})
export class RequestlistComponent implements OnInit {
  /*@Input()*/ listP: any[]=[]
  @Output() send=new EventEmitter()
  @Output() list=new EventEmitter()
  @Output() clear= new EventEmitter()
  mod:boolean=false
  info:any
  partList!: MatTableDataSource<el>
  addPart!: FormGroup
  displayedColumns:string[]=['ref','pn','desc','qty','del']
  chPn:boolean= false
  pos:string=''
  subsList:Subscription[]=[]

  constructor(private location: Location, private http:HttpClient, private clipboard:Clipboard, private auth:AuthServiceService , private route:ActivatedRoute, private quarter: GetquarterService, private fb: FormBuilder, public dialog: MatDialog, public router: Router) {
    this.addPart = fb.group({
      pn: ['',Validators.required],
      desc: ['',Validators.required],
      qty: ['',Validators.required]
    })
    this.addPart.controls.desc.disable()
    this.addPart.controls.qty.disable()
    this.partList = new MatTableDataSource()
   }

  @ViewChild("pn1") pn1!:ElementRef;

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
      })
    )
    this.route.params.subscribe(a=>{
      this.info=JSON.parse(a.info)
      //if(JSON.parse(a.info).new) this.info['date']=moment(new Date()).format('YYYY-MM-DD')
      if(JSON.parse(a.info).Parts) this.partList.data=JSON.parse(a.info).Parts
    })
  }

  ngOnChanges(){
    if(this.listP && this.listP.length>0){
      this.partList.data=this.listP
      setTimeout(() => {
        this.pn1.nativeElement.focus()
      }, 150);
    }
  }

  ngOnDestroy(){
    if(this.mod) {
      const dia = this.dialog.open(SavedialogComponent,{data:'',disableClose:true})
      dia.afterClosed().subscribe(a=>{if(a) this.saveList()})
      this.subsList.forEach(a=>{a.unsubscribe()})
    }
  }

  newPn(e:any){
    let a= ''
    if(e.target.value) a=e.target.value.toString()
    if(a.length==10) {
      firebase.database().ref('PSDItems').child(this.quarter.getQ()).child(a).once('value',b=>{
        if(b.val()!=null) {
          let c = this.addPart.controls
          c.desc.setValue(b.val().desc)
          this.chPn=true
          c.desc.enable()
          c.qty.enable()
        } else {
          let c = this.addPart.controls
          c.desc.setValue('')
          c.desc.enable()
          c.qty.enable()
        }
      })
    } else {
      let c = this.addPart.controls
      c.desc.setValue('')
      c.desc.disable()
      c.qty.disable()
      c.qty.setValue('')
      this.chPn=false
    }
  }

  add(){
    let l = this.addPart.controls
    let a = ('0000000000' + l.pn.value).slice(-10)
    let b = l.desc.value
    let c = l.qty.value
    let arr = this.partList.data
    arr.push({pn: a, desc: b, qty:c})
    this.partList.data=arr
    this.addPart.reset()
    l.desc.disable()
    l.qty.disable()
    this.pn1.nativeElement.focus()
    this.mod=true
  }

  del(a:number){
    const dialogRef=this.dialog.open(DeldialogComponent,{data: {desc: this.partList.data[a].pn, id:'0'}})
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        let arr= this.partList.data
        arr.splice(a,1)
        this.partList.data=arr
        this.list.emit(this.partList.data)
        this.mod=true
      }
      this.pn1.nativeElement.focus()
    })
  }

  save(){
    this.saveList()
  }

  upd(a:number,b:string,c:string){
    const dialogRef=this.dialog.open(InputhrsComponent,{data: {hr: b}})
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        let y:any= this.partList.data[a]
        y[c]=result
        this.list.emit(this.partList.data)
        this.mod=true
      }
    })

  }

  import(){
    const dialogRef=this.dialog.open(ImportpartsComponent)
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        let a:string[] = result.split('\n')
        let templist:el[]=[]
        let cherr:boolean=false
        a.forEach(b=>{
          let c= b.split('\t')
          if(c.length>2 && c[0].length==10 && c[1]!='' && !isNaN(parseInt(c[2]))) {
            if(c[3]){
              templist.push({pn: ('0000000000'+c[0]).slice(-10),desc:c[1] + ' (replace ' + ('0000000000'+c[3]).slice(-10) +')',qty:parseInt(c[2])})
            } else {
              templist.push({pn: ('0000000000'+c[0]).slice(-10),desc:c[1],qty:parseInt(c[2])})
            }
            this.mod=true
          } else if(c.length==1){

          } else{
            cherr=true
          }
        })
        setTimeout(() => {
          if(!cherr) {
            this.partList.data=templist
            //this.list.emit(this.partList.data)
          } else {
            alert('Wrong data format')
          }
        }, 100);
      }
    })
  }

  clearL(){
    const dialogRef=this.dialog.open(DeldialogComponent,{data:{name:'list'}})
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        this.partList.data=[]
        this.mod=true
        //this.list.emit(this.partList.data)
      }
    })
  }

  submit(){
    if(this.auth.acc('PartsRequestListSubmit')){
      /*let list:string=''
      e.forEach(a=>{
        if(list!='') list += `\n${a.pn}\t${a.qty}`
      })
      this.clipboard.copy(list)
      //window.open('https://shoponline.epiroc.com/Quote/AddItemsExcel')*/
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
        //if(!this.info.date) this.info['date']=moment(new Date()).format('YYYY-MM-DD')
        this.saveList()
        console.log(this.info)
        const dialegRef= this.dialog.open(SubmitvisitComponent, {data: this.info})
        dialegRef.afterClosed().subscribe(res=>{
          if(res!=undefined){
            let params = new HttpParams()
            .set("info",JSON.stringify(this.info))
            let url:string = environment.url
            const wait = this.dialog.open(GenericComponent, {disableClose:true, data:{msg:'Sending....'}})
            setTimeout(() => {
              wait.close()
            }, 20000)
            this.http.post(url + 'partreq',this.info, {responseType: 'json'}).subscribe((a: any)=>{
              if(a){
                firebase.database().ref('PartReqSent').child(this.info.sn).child(this.info.reqId).set(this.info)
                .then(()=>firebase.database().ref('PartReq').child(this.info.usedId).child(this.info.reqId).remove()
                .then(()=>{
                  firebase.database().ref('Updates').child('PartsSentupd').set(moment.tz(new Date(),environment.zone).format('YYYYMMDDHHmmss'))
                  wait.close()
                  this.location.back()
                  console.log('SENT ' + a)
                })
                )
              } else {alert('Error')}
            })
          }
        })
      })
    }
  }

  saveList(){
    this.info['Parts']= this.partList.data
    firebase.database().ref('PartReq').child(this.info.usedId).child(this.info.reqId).set(this.info)
    this.mod=false
  }
}



