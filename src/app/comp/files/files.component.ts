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
  files1:any[]=[]
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  start:number=0
  end:number=0
  constructor(private bak: BackService) { }

  ngOnInit(): void {
    firebase.default.storage().ref('Closed').listAll()
    .then(a=>{
      a.items.map(b=>{
        b.getDownloadURL()
        .then(async c=>{
          let f = {name:b.name,uri:c}
          this.files.push(f)
          if (this.files.length==a.items.length){
            await this.files.reverse()
            this.start=1
            this.end=10
            this.files1 = this.files.slice(this.start,this.end)
          }
        })
      })
    })
  }
  open(a:string){
    window.open(a)
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
      this.files1 = this.files.slice(1,10)
    }
  }

  pageEvent(e:any){
    this.start = e.pageIndex * e.pageSize +1
    this.end = e.pageIndex* e.pageSize + e.pageSize
    this.files1=this.files.slice(this.start,this.end)
  }
}
