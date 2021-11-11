import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app'

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
  appearance:MatFormFieldAppearance='fill'
  constructor(private route: ActivatedRoute, private fb: FormBuilder) { 
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
        //this.conCus(this.cId[0].c2,this.cId[0].c3)
        //this.cuId(this.cId[0].id)
      } else {
        this.listVis=true
        //this.conCus('','')
      }
    }
  }
  
}
