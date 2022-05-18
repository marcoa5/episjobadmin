import { Component, OnInit, Input } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/database'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { GetPotYearService } from '../../../../serv/get-pot-year.service';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service'

export interface fam{
  bl?: string
  fam?:string
}

@Component({
  selector: 'episjob-potential',
  templateUrl: './potential.component.html',
  styleUrls: ['./potential.component.scss']
})


export class PotentialComponent implements OnInit {

  @Input() custId:string=''
  name: string=''
  custPot!:FormGroup
  refYear:any=''
  potTot:any=0
  pos:string=''
  subsList:Subscription[]=[]

  constructor(fb:FormBuilder, private anno:GetPotYearService, private auth: AuthServiceService) {
    this.custPot=fb.group({
      'SED': [0,Validators.required],
      'URE': [0,Validators.required],
      'RDD': [0,Validators.required],
      'REX': [0,Validators.required],
      'RGU': [0,Validators.required],
      'PSD': [0,Validators.required],
      'HAT': [0,Validators.required],
    })
  }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>this.pos=a.Pos)
    )
    this.refYear=this.anno.getPotYear()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>a.unsubscribe())
  }

  ngOnChanges(){
    if(this.custId){
      firebase.database().ref('CustomerC').child(this.custId).child('c1').once('value',a=>{
        if(a.val()) this.name = a.val()
      })
      .then(()=>{
        firebase.database().ref('Potential').child(this.custId + '-' + this.name.replace(/&/g,'').replace(/\./g,'')).child(this.refYear).once('value',a=>{
          if(a.val()) {
            a.forEach(b=>{
              this.custPot.controls['' + b.key].setValue(b.val())
            })
          }
        })
      })
    }
  }

  totalPot(){
    this.potTot= this.custPot.controls.SED.value
  }

  savePot(e:any){
    firebase.database().ref('Potential').child(this.custId + '-' + this.name.replace(/&/g,'').replace(/\./g,'')).child(this.refYear).child(e.target.getAttribute('formControlName')).set(e.target.value)
  }

  chPos(a:string){
    return this.auth.acc(a)
  }

}

