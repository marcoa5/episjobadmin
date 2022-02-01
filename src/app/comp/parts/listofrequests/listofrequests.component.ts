import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'

@Component({
  selector: 'episjob-listofrequests',
  templateUrl: './listofrequests.component.html',
  styleUrls: ['./listofrequests.component.scss']
})
export class ListofrequestsComponent implements OnInit {
  @Input() list: any[]=[]
  @Output() index = new EventEmitter()
  @Output() indexD=new EventEmitter()
  sortIcon:string='sn'
  sortDir:string='up'
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(){

  }

  go(a:any, e:any){
    for(let l of this.list){
      if(this.list[a]!=l) l.sel=0
    }
    if(this.list[a].sel==0) {
      this.list[a].sel=1
      this.index.emit([a,this.list[a]])
    } else if(this.list[a].sel==1) {
      this.list[a].sel=0
      this.index.emit(-1)
    }
  }

  directgo(a:any,e:any){
    this.indexD.emit(a)
  }

  sort(a:string){
    this.sortIcon=a
    if(this.sortDir=='') {
      this.sortDir='up'
    } else if(this.sortDir=='up') {
      this.sortDir='down'
    } else {
      this.sortDir='up'
    }
    if(this.sortDir=='down'){
      this.list.sort((a1:any,a2:any)=>{
        if (a1[a]<a2[a]) {
          return 1
        } else if (a1[a]>a2[a]){
          return -1
        } else {
          return 0
        }
      })
    } else{
      this.list.sort((a1:any,a2:any)=>{
        if (a1[a]<a2[a]) {
          return -1
        } else if (a1[a]>a2[a]){
          return 1
        } else {
          return 0
        }
      })
    }
  }

}
