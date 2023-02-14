import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-selectcustomer',
  templateUrl: './selectcustomer.component.html',
  styleUrls: ['./selectcustomer.component.scss']
})
export class SelectcustomerComponent implements OnInit {
  @Input() infoInput:string|undefined
  @Input() search:string=''
  @Input() comp:boolean=false
  chStr:boolean=true
  details:any[]=[]
  inputData!:FormGroup
  _customers:any[]=[]
  customers:any[]=[]
  readOnly:boolean=false
  serial:string=''
  selection:boolean=false
  @Input() detailedInfo:boolean=false
  @Output() info=new EventEmitter()
  subsList:Subscription[]=[]

  constructor(private auth:AuthServiceService, private fb: FormBuilder, private dialogRef: MatDialogRef<SelectcustomerComponent>, @Inject(MAT_DIALOG_DATA) public data:any) {
    this.inputData= new FormGroup({})
  }

  ngOnInit(): void {
    this.inputData=this.fb.group({
      id:['', Validators.required],
      c1:[this.search],
      c2:['', Validators.required],
      c3:['', Validators.required],
    })
    this.subsList.push(
      this.auth._customers.subscribe(a=>{
        if(a) {
          this._customers=a
          this.customers=this._customers.slice()
          if(this.search && this.search!='' && this.customers.length>1) {
            this.filter().then(()=>{this.sel(this.customers[0])})
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
      let f:string=this.inputData.controls.c1.value
      this.details=[]
      if(f && f.length>0){
        this.chStr=true
        this.customers=this._customers.filter(a=>{
          if(a.c1.toLowerCase().includes(f.toLowerCase()) || a.c2.toLowerCase().includes(f.toLowerCase()) || a.c3.toLowerCase().includes(f.toLowerCase())) return true
          return false
        })
        if(this.customers.length==1 && this.customers[0].c1.toLowerCase()==f.toLowerCase()) {
          this.inputData.controls.id.setValue(this.customers[0].id)
          this.inputData.controls.c2.setValue(this.customers[0].c2)
          this.inputData.controls.c3.setValue(this.customers[0].c3)
          this.selection=true
          this.info.emit(this.customers[0])
        } else {
          this.inputData.controls.id.setValue('')
          this.inputData.controls.c2.setValue('')
          this.inputData.controls.c3.setValue('')
          this.selection=false
          this.info.emit('')
        }
        res('')
      } else {
        this.customers= this._customers
      }
      this.info.emit('')
    })
  }

  sel(a:any){
    this.chStr=false
    this.details=[
      {value: a.c1, lab: 'c1', click:'', url:''},
      {value: a.c2, lab: 'c2', click:'', url:''},
      {value: a.c3, lab: 'c3', click:'', url:''},
    ]
    this.inputData.controls.id.setValue(a.id)
    this.inputData.controls.c1.setValue(a.c1)
    this.inputData.controls.c2.setValue(a.c2)
    this.inputData.controls.c3.setValue(a.c3)
    this.selection=true
    this.info.emit(a)
  }

  sn(){
    if(this.serial) return true
    return false
  }
}
