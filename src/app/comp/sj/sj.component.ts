import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-sj',
  templateUrl: './sj.component.html',
  styleUrls: ['./sj.component.scss']
})
export class SjComponent implements OnInit {

  allow:boolean=false
  pos:string=''
  customers:any[]=[]
  _rigs:any
  rigs:any
  tech:any[]=[]
  rigForm!:FormGroup
  searchForm!:FormGroup
  custForm!:FormGroup
  subsList:Subscription[]=[]
  sn:string=''
  spin:boolean=true
  constructor(private auth: AuthServiceService, private fb:FormBuilder) {
    this.searchForm=this.fb.group({
      search:''
    })
    this.rigForm=fb.group({
      sn: ['', Validators.required],
      model: ['', Validators.required],
      customer: ['', Validators.required],
      site: ['', Validators.required],
    })
    this.custForm=this.fb.group({
      search:''
    })
  }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.Pos
          setTimeout(() => {
            this.allow=this.auth.allow('sj',this.pos) 
            this.spin=false
          }, 1);
            
        }
        
      }),
      this.auth._custI.subscribe(a=>{
        if(a) this.customers=a
      }),
      this.auth._fleet.subscribe(a=>{
        if(a){
          this._rigs=a
          this.rigs=this._rigs
        }
      }),
      this.auth._tech.subscribe(a=>{
        if(a) this.tech=a
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  searchCust(e:any){
    let a = e.target.value
    this.rigs=this._rigs.filter((b:any)=>{
      return(b.sn.toLowerCase().includes(a) || b.model.toLowerCase().includes(a) || b.customer.toLowerCase().includes(a) || b.site.toLowerCase().includes(a) )
    })
    this.selRig()
  } 

  fil(a:string){
    this.rigs=this._rigs.filter((b:any)=>{
      return b.sn==a
    })
    this.selRig()
  }

  selRig(){
    if(this.rigs.length==1) {
      this.rigForm.controls.sn.setValue(this.rigs[0].sn)
      this.rigForm.controls.model.setValue(this.rigs[0].model)
      this.rigForm.controls.customer.setValue(this.rigs[0].customer)
      this.rigForm.controls.site.setValue(this.rigs[0].site)
      console.log(this.rigs[0].custid)
    } else {
      this.rigForm.reset()
    }
  }
}
