import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { MatPaginatorIntl } from '@angular/material/paginator'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import * as XLSX from 'xlsx-js-style'
import { ExcelService } from 'src/app/serv/excelexport.service';
import { MatDialog } from '@angular/material/dialog';
import { AccesslistComponent } from './accesslist/accesslist.component';

@Component({
  selector: 'episjob-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  pos:string=''
  rigs:any[]=[]
  access:any|undefined
  rigs1:any[]=[]
  filtro:string=''
  wid:boolean=true
  elenco:string=''
  start:number=0
  end:number=10
  allow: boolean=false
  allSpin:boolean=true
  tips:any[]=[]
  subsList:Subscription[]=[]

  constructor(private dialog: MatDialog, private excel:ExcelService, private auth: AuthServiceService, private router: Router, private paginator: MatPaginatorIntl, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel='#'
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('Admin', this.pos)
          this.allSpin=false
        }, 1);
      }),
      this.auth._fleet.subscribe(a=>{
        this.rigs=a
      }),
      this.auth._accessI.subscribe(a=>{ 
        if(Object.keys(a).length>0){
          this.access=a
          this.rigs1 = this.rigs.map(a=>{
            a['a1']=this.access[a.sn].a1
            a['a2']=this.access[a.sn].a2
            a['a3']=this.access[a.sn].a3
            a['a4']=this.access[a.sn].a4
            a['a5']=this.access[a.sn].a5
            a['a98']=this.access[a.sn].a98
            a['a99']=this.access[a.sn].a99
            return a
          }).slice(this.start,this.end)
        }
      })
    )    
    firebase.database().ref('Users').once('value',a=>{
      let temp:any[]=[]
      if(a.val()!=null){
        a.forEach(b=>{
          let nr:number=b.val().Area
          if(nr>0 &&  nr<90 && b.val().Pos=='sales') {
            temp.push({area:nr,val:b.val().Nome + ' ' + b.val().Cognome})
          }
        })
      }
      this.sort(temp)
      temp.push({area:98, val:'FEA Service'},{area:99, val:'IMI Fabi'})
      this.tips=temp.slice()
    })
  }

  sort(arr:any[]){
    arr.sort((b:any,c:any)=>{
      if(b.area>c.area) return 1
      if(b.area<c.area) return -1
      return 0
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  filter(a:any){
    if(a!=''){
      this.filtro=a
      this.rigs1 = this.rigs
    } 
    if (a=='') {
      this.filtro=''
      this.start=1
      this.end =10
      this.rigs1 = this.rigs.slice(0,10)
    }
  }

  type(a:any){
    this.filtro = a
    this.filter(this.filtro)
  }

  cl(e:any, a:string, b:string, i:number){
    let g = e.checked? 1 : 0
    this.rigs1[i][b]=g
    this.rigs.forEach(x=>{
      if(x.sn==a){x[b]=g}
    })
    firebase.database().ref('RigAuth/' + a).child(b).set(g.toString())
    this.filter(this.filtro)
  }

  res(){
    if(window.innerWidth<600) {
      this.wid=false
    } else {
      this.wid=true
    }
  }

  go(a:String, b:string){
    let custId:string=''
    if(b=='sn') this.router.navigate(['machine', {sn: a}])
    firebase.database().ref('CustomerC').once('value',h=>{
      let g:any = Object.values(h.val())
      g.forEach((r: any)=>{
        if(r.c1==a) custId=r.id
      })
    })
    .then(()=>{
      if(b=='cu' && custId!='') this.router.navigate(['cliente', {id: custId}])
    })
  }

  checkWidth(){
    if(window.innerWidth>650) return true
    return false
  }

  pageEvent(e:any){
    this.start = e.pageIndex * e.pageSize 
    this.end = e.pageIndex* e.pageSize + e.pageSize
    this.rigs1=this.rigs.slice(this.start,this.end)
  }

  dlAuth(){
    let index:any[]=Array.from(Array(98).keys())
    let dow:any[] = this.rigs.map(r=>{   
      index.forEach(i=>{
        if(r['a'+(i+1)]){
          r['a'+(i+1)]=parseInt(r['a'+(i+1)])
          if(r['a'+(i+1)]==0) r['a'+(i+1)]=null
        } else{
          r['a'+(i+1)]=null
        }
      })
      return r
    })
    let dele:any[]=[]
    for(let o of index){
      let temp = dow.map(d=>{return d['a'+(o+1)]})
      if(temp.indexOf(1)<0) dele.push(o+1)
    }
    let fine:any[]=[]
    dele.forEach(d=>{
      fine=dow.map(f=>{
        delete f['a'+d]
        delete f.address
        delete f.email
        delete f.name
        delete f.in
        delete f.custid
        return f
      })
    })
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dow);
      
      //Center columns
      let cols:string[]=[]

      let colWidth:any[]=[120,120,120,120,60,120]

      //columns Width
      
      let Sheets:any={}
      Sheets['Access']=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: ['Access'] 
      }
      this.excel.exportAsExcelFile(workbook,'Access list',cols,colWidth)
  }

  ulAuth(){
    let d= this.dialog.open(AccesslistComponent, {panelClass:'access'})
  }

}
