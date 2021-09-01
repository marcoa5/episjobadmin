import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatFormFieldAppearance } from '@angular/material/form-field'
import firebase from 'firebase/app';
import * as moment from 'moment'
import { Location } from '@angular/common'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SavevisitComponent } from '../../util/dialog/savevisit/savevisit.component';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';

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

export interface info{
  date: string
  cuId:string
  c1: string
  c2:string
  c3: string
  name: string
  pos:string
  phone:string
  mail: string
  notes: string
  place: string
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
  customers!: customer[] |undefined
  customers1: customer[] |undefined
  cId: customer[]=[]
  contacts: contact[]=[]
  contacts1: contact[]=[]
  cuNa:string|undefined
  listVis:boolean=true
  listVisCont:boolean=true
  val:boolean=false
  userName:string=''
  comuni: string[]=[]
  _comuni: string[]=[]
  lisComVis:boolean=false
  constructor(private dialog: MatDialog, private location: Location, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        firebase.database().ref('Users').child(a.uid).once('value',b=>{
          this.userName=b.val().Nome + " " + b.val().Cognome
        })
      }
    })

    firebase.database().ref('Comuni').once('value', a=>{
      if(a.val()!=null) this._comuni = Object.keys(a.val())
    }).then(()=>this.comuni=this._comuni)


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
      this.contChange()
      this.placeChange()
    })

    this.dateFormGroup = this._formBuilder.group({
      date: [new Date(), Validators.required]
    });
    this.contactFormGroup=this._formBuilder.group({
      name: ['',Validators.required],
      pos: ['',Validators.required],
      phone: ['',Validators.required],
      mail: ['',[Validators.required, Validators.email]],
    })
    this.custFormGroup = this._formBuilder.group({
      c1: ['', Validators.required],
      c2: [{value:'',disabled: false}, Validators.required],
      c3: [{value:'',disabled: false}, Validators.required],
    });
    this.visitNotes = this._formBuilder.group({
      notes: ['',Validators.required],
      place: ['',Validators.required]
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
      .then(()=>this.contacts1=this.contacts)
    }
  }

  custChange(){
    this.custFormGroup.controls.c1.valueChanges.subscribe(v=>{
      this.contacts=[]
      this.contacts1=[]
      this.filterCust(v)
    })
  }

  contChange(){
    this.contactFormGroup.controls.name.valueChanges.subscribe(v=>{
      this.filterCont(v)
    })
  }

  checkCont(v:any) {
    let p = this.contacts.filter(a=>{
      if(a.name.toLowerCase()==v.target.value.toLowerCase()) return true
      return false
    })
      if(p.length==1){
        this.listVisCont=false
        this.conCon(p[0].name,p[0].pos,p[0].phone,p[0].mail)
      } else {
        this.listVisCont=true
        let v = this.contactFormGroup.controls
        v.mail.setValue('')
        v.phone.setValue('')
        v.pos.setValue('')
      }
  }

  filterCont(v:string){
    if(v!=''){
      this.contacts1 = this.contacts?.filter(i=>{
        if(i.name.toLowerCase().includes(v.toLowerCase()) || i.pos.toLowerCase().includes(v.toLowerCase())) return true
        return false
      })
    } else {
      this.contacts1 = this.contacts
    }
  }

  filterCust(v:string){
    if(v!=''){
      this.customers1 = this.customers?.filter(i=>{
        if(i.c1.toLowerCase().includes(v.toLowerCase()) || i.c2.toLowerCase().includes(v.toLowerCase()) || i.c3.toLowerCase().includes(v.toLowerCase())) return true
        return false
      })
    } else {
      this.customers1 = this.customers
    }
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
    this.clearCust()
  }

  clearCust(){
    let con = this.custFormGroup.controls
    if(this.customers){
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
    if(name!='') this.listVisCont=false
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

    console.log(this.visitNotes.controls.place.value)
    let info:info={
      date: moment(this.dateFormGroup.controls.date.value).format("YYYY-MM-DD"),
      cuId: this.cId[0]?this.cId[0].id:'00000POT'+this.makeid(10),
      c1: this.custFormGroup.controls.c1.value,
      c2: this.custFormGroup.controls.c2.value,
      c3: this.custFormGroup.controls.c3.value,
      name: this.contactFormGroup.controls.name.value,
      pos: this.contactFormGroup.controls.pos.value,
      phone: this.contactFormGroup.controls.phone.value,
      mail: this.contactFormGroup.controls.mail.value,
      notes: this.visitNotes.controls.notes.value,
      place: this.visitNotes.controls.place.value,
    }

    const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(SavevisitComponent, {
        data: {sn: ''}
      });
      // ADD check per modifica matricola
      dialogRef.afterClosed().subscribe(result => {
        if(result=='ok'){
          firebase.database().ref('CustVisit').child(info.cuId + '-' + info.c1).child(this.userName).child(info.date).set(info)
          .then(()=>{
            firebase.database().ref('Contacts').child(info.cuId).child(info.name).set({
              pos: info.pos,
              mail: info.mail,
              phone:info.phone,
              name: info.name
            })
            .then(()=>{
              if(info.cuId.substring(0,8)=='00000POT'){
                firebase.database().ref('CustomerC').child(info.cuId).set({
                  c1: info.c1,
                  c2: info.c2,
                  c3:info.c3,
                  id: info.cuId
                })
              }
              setTimeout(() => {
              this.location.back()
                
              }, 250);
            })
          })
        }
      })
  }

  makeid(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  placeChange(){
    this.visitNotes.controls.place.valueChanges.subscribe(v=>{
      if(v.length>2) {
        this.filterPlace(v.toLowerCase())
      } else {
        this.lisComVis = false
        this.comuni=this._comuni
      }
    })
  }

  filterPlace(v:string){
    this.lisComVis=true
    this.comuni = this._comuni.filter(a=>{
      if (a.toLowerCase().includes(v.toLowerCase())) return true
      return false
    })
  }

  checkPlace(v:any){
    let r = this.comuni.filter(b=>{
      if(b.toLowerCase()==v.target.value.toLowerCase()) {
        return true
      }
      return false
    })
    if(r.length==1) {
      this.conPlace(r.toString())
    } else {
      this.visitNotes.controls.place.setErrors({})
    }
  }

  conPlace(a:string){
    this.visitNotes.controls.place.setValue(a)
    this.lisComVis=false
  }
}
