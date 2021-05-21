import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import * as firebase from 'firebase'
import { BackService } from '../../serv/back.service'

@Component({
  selector: 'episjob-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  cust1:string=''
  cust2: string|undefined
  cust3: string|undefined
  custrig:any[]|undefined
  constructor(public route: ActivatedRoute, private bak: BackService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      this.cust1=a.cust1
      this.cust2 = a.cust2
      this.cust3 = a.cust3
    })
    firebase.default.database().ref('MOL').orderByChild('customer').equalTo(this.cust1).once('value',k=>{
      this.custrig=Object.values(k.val())
    })
  }

  back(){
    this.bak.backP()
  }

  open(a:string){
    this.router.navigate(['machine',{sn:a}])
  }

}
