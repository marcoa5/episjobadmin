import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Subscriber, Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-selectmachine',
  templateUrl: './selectmachine.component.html',
  styleUrls: ['./selectmachine.component.scss']
})
export class SelectmachineComponent implements OnInit {
  @Input() infoInput:string|undefined
  chStr:boolean=true
  details:any[]=[]
  inputData!:FormGroup
  _rigs:any[]=[]
  rigs:any[]=[]
  appearance:MatFormFieldAppearance='fill'
  serial:string=''
  @Output() info=new EventEmitter()
  subsList:Subscription[]=[]

  constructor(private fb:FormBuilder, public auth: AuthServiceService) {
    this.inputData=fb.group({
      id:['', Validators.required],
      sn:[''],
      model:['', Validators.required],
      customer:['', Validators.required],
      custCode:['', Validators.required],
      type:['', Validators.required],
      start:['', Validators.required],
      end:['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._rigs.subscribe(a=>{
        if(a) {
          this._rigs=a
          this.rigs=this._rigs.slice()
        }
      })
    )
    if(this.infoInput) this.sel(this.infoInput)
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{
      a.unsubscribe()
    })
  }

  filter(){
    let f=this.inputData.controls.sn.value
    this.details=[]
    if(f.length>0){
      this.chStr=true
      this.rigs=this._rigs.filter(a=>{
        if(a.sn.toLowerCase().includes(f.toLowerCase()) || a.model.toLowerCase().includes(f.toLowerCase()) || a.customer.toLowerCase().includes(f.toLowerCase())) return true
        return false
      }) 
    } else {
      this.rigs= this._rigs
    }
    this.info.emit(undefined)
  }

  sel(a:any){
    this.chStr=false
    this.details=[
      {value: a.sn, lab: 'Serial nr.', click:'', url:''},
      {value: a.model, lab: 'Model', click:'', url:''},
      {value: a.customer, lab: 'Customer', click:'', url:''},
    ]
    this.inputData.controls.sn.setValue(a.sn)
    this.inputData.controls.model.setValue(a.model)
    this.inputData.controls.customer.setValue(a.customer)
    this.inputData.controls.custCode.setValue(a.custid)
    this.info.emit(a)
  }

  sn(){
    if(this.serial) return true
    return false
  }
}
