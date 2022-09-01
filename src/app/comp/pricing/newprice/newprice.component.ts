import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/app'
import { GetquarterService } from 'src/app/serv/getquarter.service';

@Component({
  selector: 'episjob-newprice',
  templateUrl: './newprice.component.html',
  styleUrls: ['./newprice.component.scss']
})
export class NewpriceComponent implements OnInit {
  item!:FormGroup
  newItem:boolean=true
  periods:any[]=[]
  constructor(private fb:FormBuilder, private getQ: GetquarterService) {
    this.item = fb.group({
      pn:['', Validators.required],
      period:['',Validators.required],
      llp:['',Validators.required],
      desc:['',Validators.required],
    })
  }

  ngOnInit(): void {
    firebase.database().ref('PSDItems').once('value',a=>{
      a.forEach(b=>{
        if(b.key) {
          this.periods.push({value: b.key, text:b.key.substring(4,6) + ' - ' + b.key.substring(0,4)})
        }
      })
    })
    let r = this.getQ.getQ(new Date())
    this.item.controls.period.setValue(r)
  }

  chPrice(){
    if(this.item.controls.period.value && this.item.controls.pn.value.length==10){
      firebase.database().ref('PSDItems').child(this.item.controls.period.value).child(this.item.controls.pn.value).once('value',b=>{
        if(b.val()) {
          this.item.controls.llp.setValue(b.val().llp)
          this.item.controls.desc.setValue(b.val().desc)
          this.newItem=false
        } else{
          this.item.controls.llp.setValue('')
          this.item.controls.desc.setValue('')
          this.newItem=true
        }
      })
    }
  }

  add(){
    let t = this.item.value
    firebase.database().ref('PSDItems').child(t.period).child(t.pn).set({
      pn: t.pn,
      desc: t.desc,
      llp: t.llp,
    })
    .then(()=>{
      let r = this.getQ.getQ(new Date())
      this.item.controls.period.setValue(r)
      this.item.reset()
    })
  }

  chOffline(){
    return !navigator.onLine
  }

}
