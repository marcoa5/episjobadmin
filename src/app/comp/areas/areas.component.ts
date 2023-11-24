import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../util/dialog/confirm/confirm.component';

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
  constructor(private dialog:MatDialog, public auth: AuthServiceService, private fb:FormBuilder) {}

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
    let temp:any[]=[]
    firebase.database().ref('Users').once('value',a=>{ 
      if(a.val()!=null){
        a.forEach(b=>{
          let nr:number=b.val().Area
          if(nr>0 &&  nr<90 && b.val().Pos=='sales') {
            temp.push({id:nr,val:b.val().Nome + ' ' + b.val().Cognome,userId:b.key})
          }
        })
      }
    }).then(()=>{
      firebase.database().ref('ExtraAreas').once('value',a=>{
        if(a.val()!=null){
          a.forEach(b=>{
            temp.push({id:b.key,val:b.val()})
          })
        }
      }).then(()=>{
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
      
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  delete(id:number){
    let d = this.dialog.open(ConfirmComponent,{data:{title:'Confirm',msg:'Delete Area #' +this.areas[id]['id'] + ' (' +this.areas[id]['val'] +')?'}})
    d.afterClosed().subscribe(res=>{
      if(res){
        firebase.database().ref('ExtraAreas').child(this.areas[id]['id']).remove()
        .then(()=>{
          this.areas.splice(id,1)
          let lll:any[]=[]
          firebase.database().ref('RigAuth').once('value',list=>{
            if(list.val()!=null) {
              lll=Object.keys(list.val())
            }
          }).then(()=>{
            if(lll.length>0){
              lll.forEach(l=>{
                firebase.database().ref('RigAuth').child(l).child('a'+id).remove()
              })
            }
          })
        })
      }
    })
  }

  check(i:number){
    let c = this.area.controls['id'+(i+1)]
    this.areas[i].id=c.value
    if(c.value<0 || c.value>99 || c.value==null) c.setErrors({err:'out of range'})
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
    console.log(this.areas)
    firebase.database().ref('ExtraAreas').remove()
    this.areas.forEach(a=>{
      if(a.userId){
        firebase.database().ref('Users').child(a.userId).child('Area').set('' + a.id)
      } else {
        firebase.database().ref('ExtraAreas').child(a.id).set(a.val)
      }
      
    })
    this.original=this.areas.map(a=>{return a.id})
  }

  add(){

    let temp:any={id:'97',val:''}
    this.areas.push(temp)
    this.sort(this.areas)
    console.log(this.areas)
    //this.area.controls.id.setValue(97)
    //this.area.controls.val.setValue('')
  }

}
