import { Component, isDevMode, OnInit } from '@angular/core';
import * as moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { GetPotYearService } from '../../../serv/get-pot-year.service'
import { Clipboard } from '@angular/cdk/clipboard'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CopyComponent } from '../../util/dialog/copy/copy.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';
import { threadId } from 'worker_threads';

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
  constructor(public auth: AuthServiceService, public route: ActivatedRoute, private router: Router, private year: GetPotYearService, public clipboard: Clipboard, private dialog: MatDialog) {}

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
  }

  ngOnDestroy(){
    this.routeP.unsubscribe()
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  getFleet(a:any[]){
    this.rigsLabels=[]
    this._rigsLabels=[]
    a.filter(b=>{
      return b.custid==this.id
    }).forEach(c=>{
      this._rigsLabels.push({value: c.model,lab:c.sn,click:c.sn, url:'machine'})
      if(this.pos=='sales'){
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
                        if(d.val().cuId==this.id && ((this.pos=='SU' || this.pos=='adminS') || (this.pos=='sales' && this.userId == c.key?.toString().substring(0,28)))){
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
    firebase.database().ref('Contacts').child(this.id).once('value',a=>{
      if(a.val()!=null){
        a.forEach(b=>{
          this.infoContacts.push(
            {value: b.val().name, lab:b.val().pos,click:{custId: this.id, name: b.val().name, pos: b.val().pos, phone: b.val().phone, mail: b.val().mail}, url:'contact'}
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
    this.elenco=[]
    this.elenco.push('sn;model;date;SJ nr;Eng hrs;Perc1 hrs;Perc2 hrs;Perc3 hrs')
    firebase.database().ref('Saved').once('value',a=>{
        a.forEach(b=>{
            b.forEach(c=>{
                let x = c.val()
                if(x.cliente11==this.cust1) {
                    this.elenco.push(x.matricola+';'+x.prodotto1+';'+x.data11+';'+x.docbpcs+';'+x.orem1+';'+x.perc11+';'+x.perc21+';'+x.perc31)
                }
            })
        })
    })
    .then(()=>{
      this.clipboard.copy(this.elenco.toString().replace(/,/g,'\n').replace(/;/g,'\t'))
      const dialogconf = new MatDialogConfig;
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(CopyComponent, {
        data: {}
      });
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