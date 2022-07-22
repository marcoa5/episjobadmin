import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewpartsrequestComponent } from './newpartsrequest/newpartsrequest.component';
import { MakeidService } from '../../serv/makeid.service'
import firebase from 'firebase/app';
import 'firebase/database'
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service'
import { GetPartPerTechService } from 'src/app/serv/get-part-per-tech.service'
import * as XLSX from 'xlsx-js-style'
import { Clipboard } from '@angular/cdk/clipboard'
import { ExcelService } from 'src/app/serv/excelexport.service';


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


  constructor(private excel:ExcelService, private ppt:GetPartPerTechService , public dialog: MatDialog, public router: Router, public makeid: MakeidService, public route: ActivatedRoute, public auth:AuthServiceService, public clip:Clipboard) { }

  //@ViewChild('search') search!: ElementRef

  ngOnInit() {
    return new Promise(res=>{
      this.subsList.push(
        this.auth._userData.subscribe(a=>{
            this.pos=a.Pos
            this.userId=a.uid
            setTimeout(() => {
              this.allow=this.auth.allow('All',this.pos)
              this.allSpin=false
              res('')
            }, 1);
          
        })
      )
    }).then(()=>{
      if(this.allow==true){
        this.loadlist()
        this.loadsent()
      }
    })    
  }

  ngOnChanges(){
    
  }

  sea(e:any){
    let g:string = e.toLowerCase()
    this.listSent=this._listSent.filter(r=>{
      return (
        r.sn.toLowerCase().replace(/[.]/g,'').includes(g) ||
        r.customer.toLowerCase().replace(/[.]/g,'').includes(g) ||
        r.author.toLowerCase().replace(/[.]/g,'').includes(g) ||
        r.model.toLowerCase().replace(/[.]/g,'').includes(g) ||
        r.orig.toLowerCase().replace(/[.]/g,'').includes(g) ||
        r.type.toLowerCase().replace(/[.]/g,'').includes(g)
      )
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadlist(){
    if(this.auth.acc('AdminTechRights')){
      firebase.database().ref('PartReq').on('value',b=>{
        this.list=[]
        b.forEach(c=>{
          c.forEach(d=>{
            let r = d.val()
            r.sel=0
            this.list.push(r)
          })
        })
      })
    } else if(this.auth.acc('PartsLoadDraftTech')){
      firebase.database().ref('PartReq').child(this.userId).on('value',b=>{
        this.list=[]
        b.forEach(c=>{
          if(c.val().usedId==this.userId) {
            let r = c.val()
            r.sel=0
            this.list.push(r)
          }
        })
      })
    }
  }

  loadsent(){
    this.spin=true
    if(this.auth.acc('AdminTechRights')){
      firebase.database().ref('PartReqSent').on('value',b=>{
        let l:number=Object.values(b.val()).length
        let i:number=0
        this._listSent=[]
        b.forEach(c=>{
          c.forEach(d=>{
            let g = d.val()
            g.sel=0
            this._listSent.push(g)
            this.listSent=this._listSent.slice()
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
        this.info['new']=true
        this.partList=[]
        this.router.navigate(['partrequest',{info:JSON.stringify(this.info),new:true}])
      }
    })
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
      if(this.auth.acc('SURights')) this.userReqId=e[1].usedId
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
    this.info['new']=false
    this.info['Parts']=this.partList
    this.router.navigate(['partrequest',{info:JSON.stringify(this.info)}])

  }

  openSent(a:any){
    firebase.database().ref('PartReqSent').child(a.sn).child(a.reqId).once('value',a=>{
      this.router.navigate(['partrequest',{info:JSON.stringify(a.val())}])
    })
  }

  openD(a:any){
    firebase.database().ref('PartReq').child(a.usedId).child(a.reqId).once('value',a=>{
      this.router.navigate(['partrequest',{info:JSON.stringify(a.val())}])
    })
    //
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

  chPos(a:string){
    return this.auth.acc(a)
  }

  report(){
    this.ppt.loadParts().then((val:any)=>{
      let out:any[]=val[0]
      let i:string=val[1]
      let f:string=val[2]
      out.sort((a:any,b:any)=>{
        if(a.Name>b.Name) return 1
        if(a.Name<b.Name) return -1
        return 0
      })
      let name='Parts Requests'
      let cols:string[]=['Qty']

      let colWidth:any[]=[120,60,60]
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(out)
      let Sheets:any={}
      Sheets[name]=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: [name] 
      }
      this.excel.exportAsExcelFile(workbook,name,cols,colWidth)
    })    
  }
}
