import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackService } from '../../serv/back.service'
import firebase from 'firebase'
import 'firebase/database'
import { UserposService } from '../../serv/userpos.service'

@Component({
  selector: 'episjob-rigs',
  templateUrl: './rigs.component.html',
  styleUrls: ['./rigs.component.scss']
})
export class RigsComponent implements OnInit {
  rigs:any[] | undefined;
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  pos:string|undefined
  constructor(public router: Router, public bak:BackService, private uPos:UserposService) { 
   }

  ngOnInit(): void {
    this.largh(1)
      
    firebase.database().ref('MOL').once('value')
    .then(snap=>{
      this.rigs=Object.values(snap.val())
      this.rigs.map(l=>{
      })
      this.scrollaV = true
    })
  }

  back(){
    this.bak.backP()
  }

  open(a: String, b:String, c:String){
    this.router.navigate(['machine',{sn:b}])
    //alert(`Modello: ${a}\nS/N: ${b}\nCliente: ${c}`)
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
