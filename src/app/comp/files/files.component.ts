import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import 'firebase/storage'
import{ BackService } from '../../serv/back.service'

@Component({
  selector: 'episjob-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  files:any[]=[]
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  start:number=0
  constructor(private bak: BackService) { }

  ngOnInit(): void {
    firebase.default.storage().ref('Closed').listAll()
    .then(a=>{
      a.items.map(b=>{
        b.getDownloadURL()
        .then(c=>{
          let f = {name:b.name,uri:c}
          this.files.push(f)
          if (this.files.length==a.items.length){
            this.files.reverse()
            this.start=1
          }
        })
      })
    })
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

  largh(e:any){
    if(window.innerWidth>500) {
      this.lar = true
    } else {
      this.lar=false
    }      
  }

  scrivi(e: any){
    this.filtro=e.target.value.toString()
  }

  cancella(){
    this.value=''
    this.filtro=''
  }

  back(){
    this.bak.backP()
  }

  open(a:string){
    window.open(a)
  }

  filter(a:any){
    this.filtro=a
  }
}
