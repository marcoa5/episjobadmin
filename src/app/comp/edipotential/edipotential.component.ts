import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SaveaccountComponent } from '../util/dialog/saveaccount/saveaccount.component'

export interface customer{
  id: string,
  c1: string,
  c2: string,
  c3: string
}

@Component({
  selector: 'episjob-edipotential',
  templateUrl: './edipotential.component.html',
  styleUrls: ['./edipotential.component.scss']
})
export class EdipotentialComponent implements OnInit {
  cuId:string=''
  cId: customer[]=[]
  custFormGroup!:FormGroup
  customers!: customer[] |undefined
  customers1: customer[] |undefined
  listVis:boolean=true
  pos:string=''
  appearance:MatFormFieldAppearance='fill'
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dialog: MatDialog) { 
    this.custFormGroup=fb.group({
      c1: ['', Validators.required],
      c2: [{value:'',disabled: false}, Validators.required],
      c3: [{value:'',disabled: false}, Validators.required],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      if(a) this.cId=a.id
    })
    firebase.auth().onAuthStateChanged(a=>{
      if(a!=null) firebase.database().ref('Users').child(a.uid).child('Pos').once('value',b=>{
        if(b.val()) this.pos=b.val()
      })
    })
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
  }

  chList():boolean{
    let c:string = this.custFormGroup.controls.c1.value
    if(this.customers1!=undefined){
      if(c.length>2 && this.customers1.length>0) return true
    return false
    } 
    return false
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
    this.cuId=id
    g.c2.disable()
    g.c3.disable()
    this.listVis=false
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
        this.cuId= this.cId[0].id.toString()
      } else {
        this.listVis=true
        this.conCus('','')
        this.cuId=''
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

  addCust(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(SaveaccountComponent, {
      data: {sn: ''}
    });
    // ADD check per modifica matricola
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let cus={
          id: this.cId[0]?this.cId[0].id:'00000POT'+this.makeid(10),
          c1: this.custFormGroup.controls.c1.value.toUpperCase(),
          c2: this.custFormGroup.controls.c2.value.toUpperCase(),
          c3: this.custFormGroup.controls.c3.value.toUpperCase(),
        }
        this.cuId=cus.id
        firebase.database().ref('CustomerC').child(cus.id).set(cus)
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

  cuIdCut():string{
    if(this.cuId && this.cuId.substring(0,8)=='00000POT') return this.cuId.substring(9,20)
    return this.cuId
  }
  
}
