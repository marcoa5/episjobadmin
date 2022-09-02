import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscriber, Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MakeidService } from 'src/app/serv/makeid.service';

@Component({
  selector: 'episjob-selectmachine',
  templateUrl: './selectmachine.component.html',
  styleUrls: ['./selectmachine.component.scss']
})
export class SelectmachineComponent implements OnInit {
  @Input() infoInput:string|undefined
  @Input() search:string=''
  @Input() comp:boolean=false
  chStr:boolean=true
  details:any[]=[]
  inputData!:FormGroup
  _rigs:any[]=[]
  rigs:any[]=[]
  readOnly:boolean=false
  serial:string=''
  @Output() info=new EventEmitter()
  subsList:Subscription[]=[]

  constructor(private id:MakeidService, private fb:FormBuilder, public auth: AuthServiceService) {
    this.inputData= new FormGroup({})
  }

  ngOnInit(): void {
    this.inputData=this.fb.group({
      id:['', Validators.required],
      sn:[this.search],
      model:['', Validators.required],
      customer:['', Validators.required],
      custCode:['', Validators.required],
      type:['', Validators.required],
      start:['', Validators.required],
      end:['', Validators.required]
    })
    this.subsList.push(
      this.auth._fleet.subscribe(a=>{
        if(a) {
          this._rigs=a
          if(this.comp){
            this._rigs.push({
              model: 'COMPONENT',
              sn: 'COMPONENT',
              customer: 'EPIROC ITALIA SRL',
              custid:'OL0HyfZy4q'
            })
          }
          this.rigs=this._rigs.slice()
          if(this.search && this.search!='' && this.rigs.length>1) {
            this.filter().then(()=>{this.sel(this.rigs[0])})
            this.readOnly=true
          }
        }
      })
    )
    if(this.infoInput) this.sel(this.infoInput)
  }

  ngAfterViewInit(){
    
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{
      a.unsubscribe()
    })
  }

  filter(){
    return new Promise(res=>{
      let f:string=this.inputData.controls.sn.value
      this.details=[]
      if(f && f.length>0){
        this.chStr=true
        this.rigs=this._rigs.filter(a=>{
          if(a.sn.toLowerCase().includes(f.toLowerCase()) || a.model.toLowerCase().includes(f.toLowerCase()) || a.customer.toLowerCase().includes(f.toLowerCase())) return true
          return false
        }) 
        res('')
      } else {
        this.rigs= this._rigs
      }
      this.info.emit(undefined)
    })
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
