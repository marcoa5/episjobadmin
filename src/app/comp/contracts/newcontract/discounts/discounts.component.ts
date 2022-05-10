import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {
  labels:any[]=[{lab:'RDT discount',dim:1, type:'number'},{lab:'PSD Discount',dim:1,type:'number'},{lab:'truck transport',dim:0.5,type:'text',ph:'XX% + X.XXEUR'},{lab:'air transport',dim:0.5,type:'text',ph:'XXEUR + XX%'}]
  discount!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  @Input() list:any
  @Output() save=new EventEmitter()
  @Output() valuemod=new EventEmitter()
  modif:boolean=true
  pos:string=''
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService) {
    this.discount=new FormGroup({})
    this.labels.forEach(a=>{
      this.discount.addControl(a.lab, new FormControl(a.type=='number'?0:''))
    })
  }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
      })
    )
    if(this.list){
      let g=this.discount.controls
      Object.keys(this.list).forEach((a:any)=>{
        if(this.list[a]>0 || this.list[a] != '') { 
          g[a].setValue(this.list[a])
        } 
      })
    } else {

    }
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  send(e:any){
    this.save.emit(this.discount.value)
    this.checkMod()
  }

  checkMod(){
    let g = this.discount.controls
    let index:number=0
    this.labels.forEach(a=>{
      if(this.list && g[a.lab].value!=this.list[a.lab]) index++
    })
    if(index>0) {this.modif=true} else {this.modif=false}
    this.valuemod.emit(this.modif)
  }

}
