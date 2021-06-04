import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
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
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('https://episjobreq.herokuapp.com/getusers').subscribe(a=>{
      Object.values(a).forEach(b=>{
        firebase.database().ref('Users/' + b.uid).on('value',c=>{
          this.users.push({nome: c.val().Nome, cognome: c.val().Cognome, pos: c.val().Pos, mail: b.email})
        })
      })
    })
  }

  filter(e:any){
    this.filtro=e
  }
}
