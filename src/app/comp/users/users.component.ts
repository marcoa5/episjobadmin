import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { environment } from 'src/environments/environment';

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
          this.allow=this.auth.allow('SU',this.pos)
          this.allSpin=false
        }, 1);
      })
    )
    let url:string=environment.url
    this.http.get(url + 'getusers').subscribe(a=>{
      Object.values(a).forEach(b=>{
        firebase.database().ref('Users').child(b.uid).once('value',c=>{
          firebase.database().ref('Login').child(b.uid + '-' + c.val().Nome + ' ' + c.val().Cognome ).limitToLast(1).once('value',d=>{
            let aa:any, bb:any=undefined, version:string|undefined
            if(d.val()!=null) {
              bb = Object.keys(d.val())
              let temp:any=Object.values(d.val())
              version=temp[0].AppVersion
            }
            this.users.push({nome: c.val().Nome, cognome: c.val().Cognome, pos: c.val().Pos, mail: b.email, uid:b.uid, lastlog: bb?(version?bb + ' (' + version + ')':bb):''})
            this.users.sort((a: any, b: any) => {
              if (a.lastlog < b.lastlog) {
                return 1;
              } else if (a.lastlog > b.lastlog) {
                return -1;
              } else {
                return 0;
              }
            });
          })      
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
