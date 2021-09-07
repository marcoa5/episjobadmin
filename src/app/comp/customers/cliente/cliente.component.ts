import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

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
  constructor(public route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      this.id=a.id
      firebase.database().ref('CustomerC').child(this.id).on('value', g=>{
        this.cust1=g.val().c1
        this.cust2=g.val().c2
        this.cust3=g.val().c3
        this.infoLabels =[
          {value:this.cust1,lab:'Customer Name',click:'', url:''},
          {value:this.cust2,lab:'Address 1',click:'', url:''},
          {value:this.cust3,lab:'Address 2',click:'', url:''}
        ]
      })
      firebase.database().ref('Contacts').child(this.id).once('value',a=>{
        if(a.val()!=null){
          a.forEach(b=>{
            this.infoContacts.push(
              {value: b.val().name, lab:b.val().pos,click:'', url:''}
            )
          })
        }
      })
    })

    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        this.pos=b.val().Pos
        this.area=b.val().Area
      }).then(()=>{
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

  contr(){
    if(this.rigsLabels.length==0) return false
    return true
  }

  go(e:any){
    if(e=='edit') this.router.navigate(['newc',{id:this.id,c1:this.cust1,c2:this.cust2,c3:this.cust3}])
    if(e=='contact') this.router.navigate(['contact', {id:'new', custId: this.id}])
  }

}
