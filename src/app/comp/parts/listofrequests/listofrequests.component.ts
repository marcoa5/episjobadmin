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
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(){
    for(let l of this.list){
      l.sel=0
      firebase.database().ref('Users').child(l.usedId).once('value',a=>{
        l.author = a.val().Nome + ' ' + a.val().Cognome
      })
    }
  }

  go(a:any){
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

  directgo(a:any){
    this.indexD.emit(a)
  }

}
