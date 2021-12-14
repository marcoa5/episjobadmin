import { Component, isDevMode, OnInit } from '@angular/core';
import * as moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { GetPotYearService } from '../../../serv/get-pot-year.service'

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
  constructor(public route: ActivatedRoute, private router: Router, private year: GetPotYearService) {}

  ngOnInit(): void {
    this.anno=this.year.getPotYear().toString()
    this.route.params.subscribe(a=>{
      this.id=a.id
      firebase.database().ref('CustomerC').child(this.id).once('value', g=>{
        this.cust1=g.val().c1
        this.cust2=g.val().c2
        this.cust3=g.val().c3
        this.infoLabels =[
          {value:this.cust1,lab:'Customer Name',click:'', url:''},
          {value:this.cust2,lab:'Address 1',click:'', url:''},
          {value:this.cust3,lab:'Address 2',click:'', url:''}
        ]
      })
      this.updateContacts()
    })

    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        if(b.key && b.val()){
          this.pos=b.val().Pos
          this.userId=b.key
          this.area=b.val().Area
        }
      }).then(()=>{
        let ref=firebase.database().ref('CustVisit')
        ref.on('value',a=>{
        this.listV=[]
          a.forEach(b=>{
            b.forEach(c=>{
              c.forEach(d=>{
                if(d.val().cuId==this.id && ((this.pos=='SU' || this.pos=='adminS') || (this.pos=='sales' && this.userId == b.val().substring(0,28)))){
                  let gty = d.val()
                  gty['url']= b.key+'/'+c.key + '/' + d.key
                  this.listV.push(gty)
                  this.listV.reverse()
                }
              })
            })
          })
        })
        this.rigsLabels=[]
        firebase.database().ref('MOL').orderByChild('custid').equalTo(this.id).once('value',k=>{
          if(k.val()!=null){
            this.custrig=Object.values(k.val())
            k.forEach(x=>{
              this._rigsLabels.push({value: x.val().model,lab:x.val().sn,click:x.val().sn, url:'machine'})
              if(this.pos=='sales') {
                firebase.database().ref('RigAuth/').child(x.val().sn).child('a' + this.area).once('value',g=>{
                  if(g.val()!=1) this.rigsLabels=this._rigsLabels.filter(a=>{
                    if(a.lab!=x.val().sn)return true
                    return false
                  })
                })
              } else {
                this.rigsLabels=this._rigsLabels
              }
            })
          } 
        })
      })
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