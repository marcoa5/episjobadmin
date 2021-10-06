import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackService } from '../../serv/back.service'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { UserposService } from '../../serv/userpos.service'
import { auth } from 'firebase-admin';

@Component({
  selector: 'episjob-rigs',
  templateUrl: './rigs.component.html',
  styleUrls: ['./rigs.component.scss']
})
export class RigsComponent implements OnInit {
  rigs:any[] =[];
  rigs1:any[] =[];
  cat:any
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  pos:string|undefined
  iniz:string|undefined
  auth:any[]=[]
  constructor(public router: Router, public bak:BackService, private uPos:UserposService) { 
   }

  ngOnInit(): void {
    this.largh(1)
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        this.pos=b.val().Pos
        this.iniz=b.val().Area
      })
      .then(()=>{
        firebase.database().ref('MOL').once('value', snap=>{
          this.rigs=Object.values(snap.val())
          if(this.pos=='sales' || this.pos=='customer'){
            firebase.database().ref('RigAuth/').once('value',b=>{
              this.auth = b.val()
            })
            .then((a)=>{
              this.rigs1 = this.rigs.filter((r:any)=> {
                if(this.auth[r.sn]) return this.auth[r.sn]['a'+this.iniz]==1
                return false
              })
            })
            .catch((err: any)=>{
              console.log(err,)
            })
          } else {
            this.rigs1 = this.rigs
          }
          this.scrollaV = true
        })
        .then(()=>{
          firebase.database().ref('Categ').once('value',h=>{
            Object.values(h.val()).map(g=>{
              let e:any = g
              this.rigs1.map(v=>{
                if(v.sn ==e.sn) {
                  v.div=e.div
                  v.subCat = e.subCat
                  v.path1 = "../../../assets/Rigs/" + e.subCat + ".png"
                  this.imageExists(v.path1, (fd)=>{
                    if(fd==true) {
                      v.path = "../../../assets/Rigs/" + e.subCat + ".png"
                    } else {
                      v.path=''
                    }
                  })
                }
              })
            })
          })
        })
      }) 
    })
  }

  imageExists(url: string, callback: (arg0: boolean) => void) {
    var img = new Image();
    img.onerror = function() { callback(false); };
    img.onload = function() { callback(true); };
    img.src = url;
  }

  back(){
    this.bak.backP()
  }

  open(a: String, b:String, c:String){
    this.router.navigate(['machine',{sn:b}])
  }

  scrolla(e:Event){
    
    this.currentPosition = window.pageYOffset
    if(this.currentPosition>this.oldPosition){
      this.scrollaV = false
    } else {
      this.scrollaV = true
    }
    this.oldPosition = this.currentPosition
  }

  scrivi(e: any){
    this.filtro=e.target.value.toString()
  }

  largh(e:any){
    if(window.innerWidth>500) {
      this.lar = true
    } else {
      this.lar=false
    }      
  }

  cancella(){
    this.value=''
    this.filtro=''
  }
  
  filter(a:any){
    this.filtro=a
  }


}
