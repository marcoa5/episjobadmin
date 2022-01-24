import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[]=[]
  filtro:string=''
  pos:string=''
  allow:boolean=false
  allSpin:boolean=true
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService, private http: HttpClient, private router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('users',this.pos)
          this.allSpin=false
        }, 1);
      })
    )
    this.http.get('https://episjobreq.herokuapp.com/getusers').subscribe(a=>{
      Object.values(a).forEach(b=>{
        firebase.database().ref('Users/' + b.uid).on('value',c=>{
          this.users.push({nome: c.val().Nome, cognome: c.val().Cognome, pos: c.val().Pos, mail: b.email, uid:b.uid})
        })
      })
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>a.unsubscribe())
  }


  filter(e:any){
    this.filtro=e
  }

  open(a:string, b:string){
    this.router.navigate(['newuser',{id:a, mail:b}])
  }
}
