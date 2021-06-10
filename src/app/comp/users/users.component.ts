import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import firebase from 'firebase'
import 'firebase/database'

@Component({
  selector: 'episjob-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[]=[]
  filtro:string=''
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get('https://episjobreq.herokuapp.com/getusers').subscribe(a=>{
      Object.values(a).forEach(b=>{
        firebase.database().ref('Users/' + b.uid).on('value',c=>{
          this.users.push({nome: c.val().Nome, cognome: c.val().Cognome, pos: c.val().Pos, mail: b.email, uid:b.uid})
        })
      })
    })
  }

  filter(e:any){
    this.filtro=e
  }

  open(a:string, b:string){
    this.router.navigate(['newuser',{id:a, mail:b}])
  }
}