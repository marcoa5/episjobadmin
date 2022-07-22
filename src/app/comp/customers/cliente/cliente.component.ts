import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { GetPotYearService } from '../../../serv/get-pot-year.service'
import { Clipboard } from '@angular/cdk/clipboard'
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { NewaddressComponent } from '../../util/dialog/newaddress/newaddress.component';
import { MakeidService } from 'src/app/serv/makeid.service';
import * as XLSX from 'xlsx-js-style'
import { GenericComponent } from '../../util/dialog/generic/generic.component';
import { ExcelService } from 'src/app/serv/excelexport.service';

export interface rigsLabel {
  lab: string
  value: any
  click: any
  url: any
}

@Component({
  selector: 'episjob-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  pos:string=''
  area:any=''
  cust1:string=''
  id:string=''
  customers:any[]=[]
  customersI:any
  cust2: string|undefined
  cust3: string|undefined
  custrig:any[]|undefined
  infoLabels:rigsLabel[]=[]
  _rigsLabels:rigsLabel[]=[]
  rigsLabels:rigsLabel[]=[]
  infoContacts:rigsLabel[]=[]
  dev:boolean=true
  anno:string=new Date().getFullYear().toString()
  userId:string=''
  listV:any[]=[]
  elenco:any[]=[]
  rigs:any[]=[]
  subsList:Subscription[]=[]
  routeP!:Subscription
  _address:any[]=[]
  address:any[]=[]
  add!:FormGroup

  constructor(private excel:ExcelService, private makeId:MakeidService , private fb: FormBuilder, public auth: AuthServiceService, public route: ActivatedRoute, private router: Router, private year: GetPotYearService, public clipboard: Clipboard, private dialog: MatDialog) {
    this.add=this.fb.group({})
  }

  ngOnInit(): void {
    this.routeP = this.route.params.subscribe(a=>{
      this.id=a.id
      this.updateContacts()
    })
    this.anno=this.year.getPotYear().toString()
    this.subsList.push(
      this.auth._custI.subscribe(a=>{
        if(a!=undefined) {
          this.customersI=a
          if(this.id!=''){
            this.cust1=this.customersI[this.id].c1
            this.cust2=this.customersI[this.id].c2
            this.cust3=this.customersI[this.id].c3
            this.infoLabels =[
              {value:this.cust1,lab:'Customer Name',click:'', url:''},
              {value:this.cust2,lab:'Address 1',click:'', url:''},
              {value:this.cust3,lab:'Address 2',click:'', url:''}
            ]
          }
        }
      }),
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.userId=a.uid
        this.area=a.Area
      }),
      this.auth._fleet.subscribe(a=>{this.getFleet(a)})
    )
    this.getVisits() 
    this.loadAddress()
  }

  ngOnDestroy(){
    this.routeP.unsubscribe()
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadAddress(){
    firebase.database().ref('CustAddress').child(this.id).on('value',a=>{
      this._address=[]
      this.address=[]
      if(a.val()!=null){
        let index:number=0
        let check:number = Object.keys(a.val()).length
        new Promise(res=>{
          a.forEach((b)=>{
            index++
            let c=b.val()
            this._address.push({value: c.add,path:this.id + '/' + b.key,lab:'Address #'+index})
            if(index==check) res('')
          })
        }).then(()=>{
          this.add = this.fb.group({})
          this._address.forEach((t,i)=>{
            this.add.addControl('ad'+i,new FormControl(t.value))
          })
          this.address=this._address.slice()
        }) 
      }
    })
  }

  getFleet(a:any[]){
    this.rigsLabels=[]
    this._rigsLabels=[]
    a.filter(b=>{
      return b.custid==this.id
    }).forEach(c=>{
      this._rigsLabels.push({value: c.model,lab:c.sn,click:c.sn, url:'machine'})
      if(this.auth.acc('CustomerGetFleet')){
        this.auth._access.subscribe(p=>{
          this.rigsLabels=this._rigsLabels.filter(t=>{
            let i = p.map((y:any)=>{return y.sn}).indexOf(t.lab)
            if(p[i]['a'+this.area]=='1') return true
            return false
          })
        })
      } else {
        this.rigsLabels=this._rigsLabels
      }
    })
  }

  getVisits(){
    let ref=firebase.database().ref('CustVisit')
        ref.on('value',a=>{
        this.listV=[]
          if(a.val()!=null) {
            a.forEach(b=>{
              if(b.val()!=null){
                b.forEach(c=>{
                  if(c.val()!=null){
                    c.forEach(d=>{
                      if(d.val()!=null){
                        if(d.val().cuId==this.id && ((this.auth.acc('CustomerGetVisit')) || (this.auth.acc('CustomerGetVisitSales') && this.userId == c.key?.toString().substring(0,28)))){
                          let gty = d.val()
                          gty['url']= b.key+'/'+c.key + '/' + d.key
                          this.listV.push(gty)
                          this.listV.reverse()
                        }
                      }
                    })
                  }
                })
              }
            })
          }
          
        })
  }

  updateContacts(){
    this.infoContacts=[]
    firebase.database().ref('CustContacts').child(this.id).once('value',a=>{
      if(a.val()!=null){
        a.forEach(b=>{
          this.infoContacts.push(
            {value: b.val().name, lab:b.val().pos,click:{custId: this.id, contId: b.val().contId, name: b.val().name, pos: b.val().pos, phone: b.val().phone, mail: b.val().mail}, url:'contact'}
          )
        })
      }
    })
  }

  contr(){
    if(this.rigsLabels.length==0) return false
    return true
  }

  go(e:any){
    if(e=='edit') this.router.navigate(['newc',{id:this.id,c1:this.cust1,c2:this.cust2,c3:this.cust3}])
    if(e=='contact') this.router.navigate(['contact', {id:'new', custId: this.id}])
  }

  contact(e:any){
    if(e=='created' || e=='deleted') this.updateContacts()
  }

  report(){
    const d=this.dialog.open(GenericComponent,{disableClose:true,data:{msg:'Retreiving data...'}})
    setTimeout(() => {
      d.close()
    }, 20000);
    this.elenco=[]
    //this.elenco.push('sn;model;date;SJ nr;Eng hrs;Perc1 hrs;Perc2 hrs;Perc3 hrs;Travel hrs;Working hrs;Days')
    firebase.database().ref('Saved').once('value',a=>{
        a.forEach(b=>{
            b.forEach(c=>{
                let x = c.val()
                if(x.cliente11==this.cust1) {
                  let lavoro:number=0, viaggio:number=0, ind:number=0
                    for(let i=1;i<8;i++){
                      let newDayTravel:number=0, newDayWork:number=0
                      let vl:string 
                      vl='v'
                      newDayTravel= x['spo' +vl + i + '1']?x['spo' +vl + i + '1']*1:0 + x['sps' +vl + i + '1']?x['sps' +vl + i + '1']*1:0+ x['std' +vl + i + '1']?x['std' +vl + i + '1']*1:0 + x['str' +vl + i + '1']?x['str' +vl + i + '1']*1:0 + x['mnt' +vl + i + '1']?x['mnt' +vl + i + '1']*1:0 + x['mnf' +vl + i + '1']?x['mnf' +vl + i + '1']*1:0
                      vl='l'
                      newDayWork=x['spo' +vl + i + '1']?x['spo' +vl + i + '1']*1:0 + x['sps' +vl + i + '1']?x['sps' +vl + i + '1']*1:0+ x['std' +vl + i + '1']?x['std' +vl + i + '1']*1:0 + x['str' +vl + i + '1']?x['str' +vl + i + '1']*1:0 + x['mnt' +vl + i + '1']?x['mnt' +vl + i + '1']*1:0 + x['mnf' +vl + i + '1']?x['mnf' +vl + i + '1']*1:0
                      if(newDayTravel!=0 || newDayWork!=0) ind++
                      viaggio+=newDayTravel
                      lavoro+=newDayWork
                    }
                    let dd=new Date(x.data11.substring(6,10),x.data11.substring(3,5),x.data11.substring(0,2))
                    this.elenco.push({
                      sn:x.matricola,
                      Model:x.prodotto1,
                      Date:dd,
                      SJnr:x.docbpcs,
                      EngHrs:x.orem1.replace(/[.]/,''),
                      Perc1:x.perc11.replace(/[.]/,''),
                      Perc2:x.perc21.replace(/[.]/,''),
                      Perc3:x.perc31.replace(/[.]/,''),
                      TravelHrs:viaggio,
                      WorkingHrs:lavoro,
                      Days:ind
                    })
                }
            })
        })
    })
    .then(()=>{
      let out=this.elenco
      out.sort((a:any,b:any)=>{
        if(a.sn>b.sn) return 1
        if(a.sn<b.sn) return -1
        return 0
      })
      let name=this.cust1 + ' - SJ History'
      let cols:string[]=['sn','Date','SJnr','EngHrs','Perc1','Perc2','Perc3','TravelHrs','WorkingHrs','Day']

      let colWidth:any[]=[120,120,120,120,60,60,60,60,60,60,60]
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(out)
      let Sheets:any={}
      Sheets['SJ History']=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: ['SJ History'] 
      }
      this.excel.exportAsExcelFile(workbook,name,cols,colWidth)
      d.close()
    })
  }

  chPos(a:string){
    return this.auth.acc(a)
  }

  open(value:string,path:string){
    const dia = this.dialog.open(AddressDialogComponent, {panelClass: 'attachment' , data:{value:value, path:path}})
    dia.afterClosed().subscribe(res=>{
      if(res && res!='delete') {
        firebase.database().ref('CustAddress').child(path).child('add').set(res)
        .then(()=>{
          firebase.database().ref('shipTo').once('value',k=>{
            if(k.val()){
              k.forEach(o=>{
                if(o.val().address==value) {
                  firebase.database().ref('shipTo').child(o.key!).child('address').set(res)
                }
              })
            }
          })
        })
      } else if(res=='delete') {
        console.log(path)
        firebase.database().ref('CustAddress').child(path).remove()
        .then(()=>{
          firebase.database().ref('shipTo').once('value',k=>{
            if(k.val()){
              k.forEach(o=>{
                if(o.val().address==value) {
                  firebase.database().ref('shipTo').child(o.key!).child('address').remove()
                }
              })
            }
          })
        })
      }
    })
  }

  addAddress(){
    console.log(this.id)
    const dia= this.dialog.open(NewaddressComponent)
    dia.afterClosed().subscribe(res=>{
      if(res) {
        let addId:string = this.makeId.makeId(8)
        firebase.database().ref('CustAddress').child(this.id).child(addId).child('add').set(res)
      }
    })
  }
}

function returnQ(){
  let oggi = new Date()
  let anno = oggi.getFullYear()
  let diff= moment(oggi).format('MMDD')
  let q2=moment(new Date(anno,3,1)).format('MMDD')
  let q3=moment(new Date(anno,6,1)).format('MMDD')
  let q4=moment(new Date(anno,9,1)).format('MMDD')
  if(diff<q2) return {quarter:1,year:anno}
  if(diff<q3) return {quarter:2,year:anno}
  if(diff<q4) return {quarter:3,year:anno}
  return {quarter:4,year:anno}
}

function returnRefYear(a:number,b:number){
  if(a>3) {
    return b+1
  } else {
    return b
  }

  
}