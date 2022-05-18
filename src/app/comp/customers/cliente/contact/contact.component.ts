import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'episjob-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  newItem:boolean|undefined
  rou:any
  pos:string|undefined
  custForm:FormGroup
  subsList:Subscription[]=[]

  constructor(private route: ActivatedRoute, fb: FormBuilder, private auth:AuthServiceService) {
    this.custForm = fb.group({
      'name' : ['',Validators.required],
      'pos' : ['',Validators.required],
      'phone' : ['',Validators.required],
      'mail' : ['',[Validators.required, Validators.email]],
    })
   }

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      if(a.id=='new') this.newItem=true
      if(a.id=='upd') this.newItem=false
      if(a.custId) this.rou=['cliente',{id: a.custId}]
    })
    this.subsList.push(
      this.auth._userData.subscribe(a=>this.pos=a.Pos)
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>a.unsubscribe())
  }

  checkD(): boolean{
    if(this.custForm.invalid) return false
    return true
  }


}
