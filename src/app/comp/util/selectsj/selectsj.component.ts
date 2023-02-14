import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/app'
import { Subscription } from 'rxjs'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MakeidService } from 'src/app/serv/makeid.service';

@Component({
  selector: 'episjob-selectsj',
  templateUrl: './selectsj.component.html',
  styleUrls: ['./selectsj.component.scss']
})
export class SelectsjComponent implements OnInit {
  @Input() infoInput:string|undefined
  @Input() search:string=''
  @Input() comp:boolean=false
  spin:boolean=true
  chStr:boolean=true
  details:any[]=[]
  inputData!:FormGroup
  _sj:any[]=[]
  sj:any[]=[]
  readOnly:boolean=false
  serial:string=''
  selection:boolean=false
  rigs:any[]=[]
  @Input() detailedInfo=true
  @Output() info=new EventEmitter()
  subsList:Subscription[]=[]

  constructor(private id:MakeidService, private fb:FormBuilder, public auth: AuthServiceService) {
    this.inputData= new FormGroup({})
  }

  ngOnInit(): void {
    this.inputData=this.fb.group({
      id:['', Validators.required],
      search:[this.search],
      sn:['', Validators.required],
      customer:['', Validators.required],
      model:['', Validators.required],
    })
    this.loadSJ()
    this.subsList.push(
      this.auth._fleet.subscribe(a=>{
        if(a) this.rigs=a
      })
    )
    //if(this.infoInput) this.sel(this.infoInput)
  }

  loadSJ(){
    firebase.database().ref('Saved').once('value',a=>{
      if(a.val()!=null) {
        a.forEach(b=>{
          if(b.val()!=null){
            b.forEach(c=>{
              if(c.val()!=null)
              this._sj.push({doc:c.val().docbpcs, sn:c.val().matricola,customer:c.val().cliente11, path:c.key,sel:0})
              this._sj.reverse()
            })
          }
        })
      }
    })
    .then(()=>{
      let filter:string=this.inputData.controls.search.value
      this.sj=this._sj.filter(l=>{
        if(l.doc.toLowerCase().includes(filter.toLowerCase()) ||l.sn.toLowerCase().includes(filter.toLowerCase()) || l.customer.toLowerCase().includes(filter.toLowerCase())){
          return l
        }
        return null
      }) 
      this.spin=false
    })
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
      let f:string=this.inputData.controls.search.value
      this.details=[]
      if(f && f.length>0){
        this.chStr=true
        this.sj=this._sj.filter(a=>{
          if(a.doc.toLowerCase().includes(f.toLowerCase()) || a.sn.toLowerCase().includes(f.toLowerCase()) || a.customer.toLowerCase().includes(f.toLowerCase())) return true
          return false
        }) 
        if(this.sj.length==1 && this.inputData.controls.search.value.toLowerCase()==this.sj[0].doc.toLowerCase()){
          let a:any = this.sj[0]
          this.details=[
            {value: a.sn, lab: 'Serial nr.', click:'', url:''},
            {value: a.model, lab: 'Model', click:'', url:''},
            {value: a.customer, lab: 'Customer', click:'', url:''},
          ]
          this.inputData.controls.search.setValue(a.doc)
          this.inputData.controls.customer.setValue(a.customer)
          this.inputData.controls.sn.setValue(a.sn)
          this.inputData.controls.model.setValue(this.rigs[this.rigs.map(a=>{return a.sn.toLowerCase()}).indexOf(a.sn.toLowerCase())].model)
          this.selection=true
          this.info.emit(a)
        } else {
          this.inputData.controls.customer.setValue('')
          this.inputData.controls.sn.setValue('')
          this.inputData.controls.model.setValue('')
          this.selection=false
          this.info.emit('')
        }
        res('')
      } else {
        this.sj= this._sj
      }
      this.info.emit(undefined)
    })
  }

  sel(a:any){
    this.chStr=false
    this.inputData.controls.search.setValue(a.doc)
    this.inputData.controls.customer.setValue(a.customer)
    this.inputData.controls.sn.setValue(a.sn)
    this.inputData.controls.model.setValue(this.rigs[this.rigs.map(a=>{return a.sn.toLowerCase()}).indexOf(a.sn.toLowerCase())].model)
    this.selection=true
    this.info.emit(a)
  }

  sn(){
    if(this.serial) return true
    return false
  }
}
