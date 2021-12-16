import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatFormFieldAppearance } from '@angular/material/form-field'
import firebase from 'firebase/app';
import { ActivatedRoute } from '@angular/router'
import * as moment from 'moment'
import { Location } from '@angular/common'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SavevisitComponent } from '../../util/dialog/savevisit/savevisit.component';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { Router } from '@angular/router'
import { NotifService } from '../../../serv/notif.service'
import { MatChip } from '@angular/material/chips';
import { NewcontactComponent } from '../../util/dialog/newcontact/newcontact.component';
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
  /*name: string
  pos:string
  phone:string
  mail: string*/
  notes: string
  place: string
  sam: string
  epiAtt: any[]
  cusAtt: string[]
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
  potential:any;
  custFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  custPotential!:FormGroup
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
  userId:string=''
  comuni: string[]=[]
  _comuni: string[]=[]
  lisComVis:boolean=false
  infoDate:Date=new Date()
  disDate:boolean=false
  epiAtt:any[]=[]
  epiList:any[]=[]
  custList:string[]=[]
  custAtt:string[]=[]
  constructor(private dialog: MatDialog, private location: Location, private _formBuilder: FormBuilder, private route:ActivatedRoute, private router: Router, public notif: NotifService) { }

  ngOnInit(): void {

    
    firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        firebase.database().ref('Users').child(a.uid).once('value',b=>{
          this.userId=a.uid
          this.userName=b.val().Nome + " " + b.val().Cognome
        })
      }
    })
    firebase.database().ref('Users').once('value',h=>{
      h.forEach(d=>{
        let r = d.val().userVisit
        if((r=='true' || r==true) && d.key!=this.userId) this.epiAtt.push({name: `${d.val().Nome} ${d.val().Cognome}`, id: d.key})
      })
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
      this.placeChange()
    })

    this.dateFormGroup = this._formBuilder.group({
      date: [this.infoDate, Validators.required]
    });
    this.contactFormGroup=this._formBuilder.group({
      /*name: ['',Validators.required],
      pos: ['',Validators.required],
      phone: ['',Validators.required],
      mail: ['',[Validators.required, Validators.email]],*/
    })
    this.custFormGroup = this._formBuilder.group({
      c1: ['', Validators.required],
      c2: [{value:'',disabled: false}, Validators.required],
      c3: [{value:'',disabled: false}, Validators.required],
    });
    this.visitNotes = this._formBuilder.group({
      notes: ['',Validators.required],
      place: ['',Validators.required],
      todo1: [''],
      todo1Date: [''],      
      todo2: [''],
      todo2Date: [''],      
      todo3: [''],
      todo3Date: [''],
    })
    this.route.params.subscribe(a=>{
      if(a && a.date) {
        this.dateFormGroup.controls.date.setValue(new Date(a.date))
      }
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



  custChange(){
    this.custFormGroup.controls.c1.valueChanges.subscribe(v=>{
      this.filterCust(v)
    })
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
    //this.cuId(id)
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

  conNotes(a:string,b:string){
    this.visitNotes.controls.notes.setValue(a)
    this.visitNotes.controls.place.setValue(b)
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
      this.conNotes('','')
      this.listVis=true
      this.listVisCont=true
    }
    if(r==1) {
      this.conNotes('','')
      this.listVisCont=true
    }
    if(r==2){
      this.conNotes('','')
    }
  }

  go(){
    return !this.custFormGroup.invalid && !this.dateFormGroup.invalid && !this.visitNotes.invalid
    
  }

  submit(){
    let info:info={
      date: moment(this.dateFormGroup.controls.date.value).format("YYYY-MM-DD"),
      cuId: this.cId[0]?this.cId[0].id:'00000POT'+this.makeid(10),
      c1: this.custFormGroup.controls.c1.value.toUpperCase(),
      c2: this.custFormGroup.controls.c2.value.toUpperCase(),
      c3: this.custFormGroup.controls.c3.value.toUpperCase(),
      notes: this.visitNotes.controls.notes.value,
      place: this.visitNotes.controls.place.value,
      sam: this.userName,
      epiAtt: this.epiList,
      cusAtt: this.custList 
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
          firebase.database().ref('CustVisit').child(moment(this.dateFormGroup.controls.date.value).format("YYYYMMDD")).child(this.userId+'-'+this.userName).child(info.cuId + '-' + info.c1.replace(/[.,&/]/g,'')).set(info)
          .then(()=>{
            if(info.cuId.substring(0,8)=='00000POT'){
              firebase.database().ref('CustomerC').child(info.cuId).set({
                c1: info.c1.toUpperCase(),
                c2: info.c2.toUpperCase(),
                c3:info.c3.toUpperCase(),
                id: info.cuId
              })
            }
            let users:string[]=[]
            firebase.database().ref('Users').once('value',a=>{
              a.forEach(b=>{
                if((b.val().Pos=='SU' || b.val().Pos=='adminS' || info.epiAtt.map(r=>{return r.id}).includes(b.key)) && b.val().visit=='1') {
                  if(b.key) users.push(b.key)
                }
              })
            })
            .then(()=>{
              if(users.includes(this.userId)) users.splice(users.indexOf(this.userId),1)
              this.notif.newNotification(users,'New Visit by ' + this.userName, info.c1 + ' on ' + moment(info.date).format('DD/MM/YYY'), this.userName, 'visit', './visit;day=' + info.date)
            })
            setTimeout(() => {
            this.router.navigate(['visit',{day:info.date}])
              
            }, 250);
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

  currency(e:any){
    //e.target.value += ' kEUR' 
  }

  setToDo(n:number){
    if(this.visitNotes.controls['todo' + n].value!='') {
      this.visitNotes.controls['todo' + n + 'Date'].setErrors({Required:true})
      this.visitNotes.controls['todo' + n + 'Date'].invalid
    }
  }

  select(a:MatChip, b:string, c?:string){
    if(c){
      a.toggleSelected()
      let val = {id:b, name:c}
      if(a.selected) {
        this.epiList.push(val)
      } else {
        let i = this.epiList.map(a=>{return a.id}).indexOf(b)
        this.epiList.splice(i,1)
      }
    } else {
      a.toggleSelected()
      if(a.selected) {
        this.custList.push(b)
      } else {
        this.custList.splice(this.custList.indexOf(b),1)
      }
    }
  }

  cuId(a:string){
    firebase.database().ref('Contacts').child(a).on('value',a=>{
      this.custAtt=[]
      a.forEach(b=>{
        this.custAtt.push(b.val().name)
      })
    })
  }

  addCon(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(NewcontactComponent, {
      data: {id: this.cId[0].id, type: 'new'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        //this.newCont.emit(result)
      }
    })
  }

}
