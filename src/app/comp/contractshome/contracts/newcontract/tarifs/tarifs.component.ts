import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';


@Component({
  selector: 'episjob-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrls: ['./tarifs.component.scss']
})
export class TarifsComponent implements OnInit {
  @Input() list:any[]=[]
  @Input() type:string=''
  typeAd:string=''
  @Output() save = new EventEmitter()
  @Output() valuemod= new EventEmitter()
  fees!:FormGroup
  pos:string=''
  modif:boolean=false
  labels:any[]=[{lab:'spo',di:0.5},{lab:'sps',dim:0.5},{lab:'std',dim:0.5},{lab:'str',dim:0.5},{lab:'mnt',dim:0.5},{lab:'mf',dim:0.5},{lab:'mnf',dim:0.5},{lab:'km',dim:0.1},{lab:'spv',dim:0.5},{lab:'off',dim:0.5},{lab:'ofs',dim:0.5},{lab:'day',dim:10},{lab:'lump sum travel',dim:10},{lab:'ROC CARE',dim:0.5},{lab:'COP CARE',dim:0.5},{lab:'ROC&COP CARE',dim:0.5}]
  subsList:Subscription[]=[]
  
  constructor(private fb:FormBuilder, private auth:AuthServiceService) {
    this.fees=new FormGroup({})
    this.labels.forEach(a=>{
      this.fees.addControl(a.lab, new FormControl(parseFloat('0').toFixed(2)))
    })
  }

  ngOnInit(): void {
    this.typeAd=this.type?this.type.substring(0,14):''
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
      })
    )
    if(this.list){
      let g=this.fees.controls
      Object.keys(this.list).forEach((a:any)=>{
        if(this.list[a]>0) {
          g[a].setValue(parseFloat(this.list[a]).toFixed(2))
        } else {
          g[a].setValue(parseFloat('0').toFixed(2))
        }
      })
    } else {

    }
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  send(e:any, name:string){
    if(name=='ROC CARE' || name == 'COP CARE') {
      let con = this.fees.controls
      let sum:number=con['ROC CARE'].value*1 + con['COP CARE'].value*1
      con['ROC&COP CARE'].setValue(sum.toFixed(2))
    }
    this.save.emit(this.fees.value)
    this.checkMod()
  }

  mod(e:any){
    e.target.value=parseFloat(e.target.value).toFixed(2)
  }

  checkMod(){
    let g = this.fees.controls
    let index:number=0
    this.labels.forEach(a=>{
      if(this.list && g[a.lab].value!=this.list[a.lab]) index++
    })
    if(index>0) {this.modif=true} else {this.modif=false}
    this.valuemod.emit(this.modif)
  }
  

}
