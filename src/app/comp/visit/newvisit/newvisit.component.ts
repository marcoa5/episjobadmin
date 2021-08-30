import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatFormFieldAppearance } from '@angular/material/form-field'
import firebase from 'firebase/app';


export interface customer{
  id: string,
  c1: string,
  c2: string,
  c3: string
}

export interface contact{
  name: string,
  phone: string,
  mail: string,
  pos: string,
}

@Component({
  selector: 'episjob-newvisit',
  templateUrl: './newvisit.component.html',
  styleUrls: ['./newvisit.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class NewvisitComponent implements OnInit {
  appearance:MatFormFieldAppearance="fill"
  dateFormGroup!: FormGroup;
  visitNotes!: FormGroup;
  custFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  customers: customer[] |undefined
  customers1: customer[] |undefined
  cId: customer[] |undefined
  contacts: contact[]=[]
  cuNa:string|undefined
  listVis:boolean=true
  val:boolean=false
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    firebase.database().ref('CustomerC').once('value',a=>{
      this.customers=Object.values(a.val())
      this.customers.sort((a, b)=> {
          if (a.c1 < b.c1) {
            return -1;
          }
          if (a.c1 > b.c1) {
            return 1;
          }
          return 0
      })
    })
    .then(()=>{
      this.customers1=this.customers
      this.custChange()
    })

    this.dateFormGroup = this._formBuilder.group({
      date: [new Date(), Validators.required]
    });
    this.contactFormGroup=this._formBuilder.group({
      name: ['',Validators.required],
      pos: ['',Validators.required],
      phone: ['',Validators.required],
      mail: ['',Validators.required],
    })
    this.custFormGroup = this._formBuilder.group({
      c1: ['', Validators.required],
      c2: [{value:'',disabled: false}, Validators.required],
      c3: [{value:'',disabled: false}, Validators.required],
    });
    this.visitNotes = this._formBuilder.group({
      notes: ['',Validators.required]
    })
  }

  setAdd(e:any){
    firebase.database().ref('CustomerC').child(e.value).once('value',a=>{
      if(a.val()){
        this.custFormGroup?.controls.c2.setValue(a.val().c2)
        this.custFormGroup?.controls.c3.setValue(a.val().c3)
      }
    })

  }


  f(a:number){
    this.customers1=this.customers
    this.custFormGroup?.controls.c1.setValue('')
    this.custFormGroup?.controls.c1N.setValue('')
    this.custFormGroup?.controls.c2.setValue('')
    this.custFormGroup?.controls.c3.setValue('')
    if(a==2) {
      this.custFormGroup.controls.c2.enable()
      this.custFormGroup.controls.c3.enable()
    }
    if(a==1) {
      this.custFormGroup.controls.c2.disable()
      this.custFormGroup.controls.c3.disable()
    }
  }

  cuId(id:string){
    this.contacts=[]
    if(id!=''){
      firebase.database().ref('Contacts').child(id).once('value',a=>{
        if(a.val()!=null){
          this.contacts=Object.values(a.val())
          this.contacts.sort((a, b)=> {
          if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
              return 0
          })
        }
      })
    }
  }

  custChange(){
    this.custFormGroup.controls.c1.valueChanges.subscribe(v=>{
      if(v!=''){
        this.customers1 = this.customers?.filter(i=>{
          if(i.c1.toLowerCase().includes(v.toLowerCase()) || i.c2.toLowerCase().includes(v.toLowerCase()) || i.c3.toLowerCase().includes(v.toLowerCase())) return true
          return false
        })
      } else {
        this.customers1 = this.customers
      }
    })
  }

  addC(c1:string,c2:string,c3:string,id:string){
    let g = this.custFormGroup.controls
    g.c1.setValue(c1)
    g.c2.setValue(c2)
    g.c3.setValue(c3)
    this.cuId(id)
    g.c2.disable()
    g.c3.disable()
    this.listVis=false
  }

  clearCust(){
    let con = this.custFormGroup.controls
    this.cId = this.customers?.filter(v=>{
      if(v.c1.toLowerCase()==con.c1.value.toLowerCase()) return true
      return false
    })
    if(this.cId?.length==1) {
      this.listVis=false
      con.c1.setValue(this.cId[0].c1)
      this.conCus(this.cId[0].c2,this.cId[0].c3)
      this.cuId(this.cId[0].id)
    } else {
      this.listVis=true
      this.conCus('','')
    }
  }

  conCus(c2:string,c3:string){
    let con = this.custFormGroup.controls
    
    if(c2=='') {
      con.c2.setValue('')
      con.c2.enable()
    } else {
      con.c2.setValue(c2)
      con.c2.disable()
    }
    if(c3=='') {
      con.c3.setValue('')
      con.c3.enable()
    } else {
      con.c3.setValue(c3)
      con.c3.disable()
    }
  }

  chList():boolean{
    let c:string = this.custFormGroup.controls.c1.value
    if(this.customers1!=undefined){
      if(c.length>2 && this.customers1.length>0) return true
    return false
    } 
    return false
    
  }

  conCon(name:String, pos:string,phone:string,mail:string){
    let r = this.contactFormGroup.controls
    r.name.setValue(name)
    r.pos.setValue(pos)
    r.phone.setValue(phone)
    r.mail.setValue(mail)
    if(name=='') this.contacts=[]
  }

  conNotes(a:string){
    this.visitNotes.controls.notes.setValue(a)
  }

  back(e:FormGroup){
    for(let c in e.controls){
      e.controls[c].setValue('')
      e.controls[c].enable()
    }
    this.contacts=[]
  }

  test(e:any){
    let r= e.selectedIndex
    if(r==0) {
      this.custFormGroup.controls.c1.setValue('')
      this.conCus('','')
      this.conCon('','','','')
      this.conNotes('')
    }
    if(r==1) {
      this.conCon('','','','')
      this.conNotes('')
    }
    if(r==2){
      this.conNotes('')
    }
  }

  go(){
    if(!this.custFormGroup.invalid && !this.contactFormGroup.invalid && !this.dateFormGroup.invalid && !this.visitNotes.invalid) return true
    return false
  }

  submit(){
    
  }
}
