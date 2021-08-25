import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import * as moment from 'moment'

@Component({
  selector: 'episjob-newvisit',
  templateUrl: './newvisit.component.html',
  styleUrls: ['./newvisit.component.scss']
})
export class NewvisitComponent implements OnInit {
  valC2:string|undefined
  valC3:string|undefined
  valDate:string|undefined
  valPers:string|undefined
  valPhone:string|undefined
  valMail:string|undefined
  valPos:string|undefined
  customers:string[]=[]
  contacts:string[]=[]
  chDate:boolean | undefined
  chCustName:boolean|undefined
  chCustC2:boolean|undefined
  chCustC3:boolean|undefined
  chPers:boolean|undefined
  chContPos:boolean|undefined
  chContPhone:boolean|undefined
  chContMail:boolean|undefined
  custId:string=''
  disField:boolean|undefined
  disCont:boolean|undefined
  today: any
  constructor() {
  }

  ngOnInit(): void {
    firebase.database().ref('CustomerC').orderByChild('c1').once('value',p=>{
      p.forEach(y=>{
        this.customers.push(y.val().c1)
      })
    })
    this.today=new Date()
  }

  newDate(e:any){
    if(e!=null && e!='') {
      this.chDate=true
      this.valDate=e
    } else {
      this.chDate=false
    }
  }

  newCust(e:any){
    this.disField=false
    this.valPers=''
    this.valPhone=''
    this.valMail=''
    this.valPos=''
    this.custId=''
    if(e!='') {
      firebase.database().ref('CustomerC').orderByChild('c1').equalTo(e).once('value',a=>{
        if(a.val()!=null){
          a.forEach(b=>{
            this.valC2=b.val().c2
            this.valC3=b.val().c3
            this.disField=true
            this.custId=b.val().id
            this.arrayCont(b.val().id)
          })
        } else {
          this.valC2=''
          this.valC3=''
          this.disField=false
        }
      })
      this.chCustName=true
    } else {
      this.valC2=''
      this.valC3=''
      this.disField=false
      this.chCustName=false
    }
  }

  newCustc2(e:any){
    if(e!='') {this.chCustC2=true} else {this.chCustC2=false}
  }

  newCustc3(e:any){
    if(e!='') {this.chCustC3=true} else {this.chCustC3=false}
  }

  newPers(e:any){
    if(e!='' && e!=undefined) {
      this.chPers=true
      firebase.database().ref('Contacts').child(this.custId).child(e).once('value',a=>{
        if(a.val()) {
            this.valPhone=a.val().phone
            this.valMail=a.val().mail
            this.valPos=a.val().pos          
        } else {
            this.valPhone=''
            this.valMail=''
            this.valPos=''
        }
      })
    } else {this.chPers=false}

  }

  newContPos(e:any){
    if(e!='') {this.chContPos=true} else {this.chContPos=false}

  }

  newContPhone(e:any){
    if(e!='') {this.chContPhone=true} else {this.chContPhone=false}
  }

  newContMail(e:any){
    if(e!='') {this.chContMail=true} else {this.chContMail=false}
  }

  newNote(e:any){

  }

  chOk():boolean{
    if(this.chDate && this.chCustName && this.chCustC2 && this.chCustC3 && this.chPers && this.chContPos && this.chContPhone && this.chContMail) return false
    return true
  }

  arrayCont(a:string){
    this.contacts=[]
    if(a!=''){
      firebase.database().ref('Contacts').child(a).once('value',b=>{
        if(b.val()!= null) this.contacts= Object.keys(b.val())
      }) 
    }
  }
}
