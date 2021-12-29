import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'episjob-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent implements OnInit {
  tech:any[]=[]
  filtro:string=''
  pos:string=''
  auth:string[]=[]
  allow:boolean=false
  constructor(private router:Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(i=>{
      this.auth=i.auth.split(',')
    })
    firebase.auth().onAuthStateChanged(a=>{
      if(a!=null) {
        firebase.database().ref('Users').child(a.uid).child('Pos').once('value',b=>{
          this.pos=b.val()
          if(this.auth.includes(this.pos)) this.allow=true
        })
        .then(()=>{
          firebase.database().ref('Tech').on('value',a=>{
            a.forEach(b=>{
              this.tech.push({l: b.key,s:b.val().s})
            })
          })
        })
      }
    })
      
  }

  filter(a:any){
    this.filtro=a
  }

  tec(a:string, b:string){
    this.router.navigate(['newtech',{fn: a, sn: b}])
  }

}
