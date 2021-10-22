import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import{ BackService } from '../../serv/back.service'
import { MatPaginatorIntl } from '@angular/material/paginator'

@Component({
  selector: 'episjob-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  files:any[]=[]
  files1:any[]=[]
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  start:number=-1
  end:number=0
  lungh:number[]=[10,25,50,100]
  pos:string|undefined
  constructor(private bak: BackService, private paginator:MatPaginatorIntl) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = '#'
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/'+a?.uid).child('Pos').once('value',b=>{
        this.pos=b.val()
      })
    })
    firebase.storage().ref('Closed').listAll()
    .then(a=>{
      a.items.map(async b=>{
          let f = {name:b.name}
          this.files.push(f)
          if (this.files.length==a.items.length){
            await this.files.reverse()
            this.lungh.push(this.files.length)
            this.start=0
            this.end=10
            this.files1 = this.files.slice(this.start,this.end)
          }
      })
    })
  }
  open(a:string){
    firebase.storage().ref('Closed').child(a).getDownloadURL()
    .then(b=>{
      window.open(b)
    })
    
  }

  filter(a:any){
    if(a!=''){
      this.filtro=a
      this.files1 = this.files
    } 
    if (a=='') {
      this.filtro=''
      this.start=1
      this.end =10
      this.files1 = this.files.slice(0,10)
    }
  }

  pageEvent(e:any){
    this.start = e.pageIndex * e.pageSize 
    this.end = e.pageIndex* e.pageSize + e.pageSize
    this.files1=this.files.slice(this.start,this.end)
  }
}
