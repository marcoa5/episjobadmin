import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app';

@Component({
  selector: 'episjob-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {
  allow:boolean=false
  allSpin:boolean=false
  pos:string=''
  area!:FormGroup
  areas:any[]=[]
  disableButton:boolean=false
  original:any[]=[]
  subsList:Subscription[]=[]
  constructor(public auth: AuthServiceService, private fb:FormBuilder) {}

  ngOnInit(): void {
    this.area=new FormGroup({})
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('SU',this.pos)
        }, 1);
      }),
    )
    firebase.database().ref('Users').once('value',a=>{
      let temp:any[]=[]
      if(a.val()!=null){
        a.forEach(b=>{
          let nr:number=b.val().Area
          if(nr>0 &&  nr<90 && b.val().Pos=='sales') {
            temp.push({id:nr,val:b.val().Nome + ' ' + b.val().Cognome,userId:b.key})
          }
        })
      }
      this.sort(temp)
      this.original=temp.map(t=>{return t.id})
      this.areas=temp.slice()
      this.areas.forEach((t,i)=>{
        this.area.addControl('id'+(i+1),new FormControl())
        this.area.addControl('val'+(i+1),new FormControl())
        this.area.addControl('user'+(i+1),new FormControl())
        this.area.controls['id'+(i+1)].setValue(t.id)
        this.area.controls['val'+(i+1)].setValue(t.val)
        this.area.controls['user'+(i+1)].setValue(t.userId)
      })
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  delete(id:number){
    console.log(id)
  }

  check(i:number){
    let c = this.area.controls['id'+(i+1)]
    this.areas[i].id=c.value
    if(c.value<0 || c.value>90 || c.value==null) c.setErrors({err:'out of range'})
    let ids:any[]=this.areas.map(a=>{return parseInt(a.id)})
    if(new Set(ids).size<this.areas.length) c.setErrors({dupl:'duplicated value'})
    this.checkArrays()
  }

  sort(arr:any[]){
    arr.sort((b:any,c:any)=>{
      if(b.id>c.id) return 1
      if(b.id<c.id) return -1
      return 0
    })
  }

  checkArrays(){
    let t1:any[] = this.areas.map((a:any)=>{return parseInt(a.id)})
    let t2:any[] = this.original
    if(t1.toString()===t2.toString()) return true
    return false
  }

  update(){
    this.areas.forEach(a=>{
      firebase.database().ref('Users').child(a.userId).child('Area').set('' + a.id)
    })
    this.original=this.areas.map(a=>{return a.id})
  }

}
