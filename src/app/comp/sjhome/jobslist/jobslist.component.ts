import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'episjob-jobslist',
  templateUrl: './jobslist.component.html',
  styleUrls: ['./jobslist.component.scss']
})
export class JobslistComponent implements OnInit {
  @Input() list:any[]=[]
  @Output() select=new EventEmitter()
  sortDir:string=''
  sortDirS:string=''
  sortIcon:string='date'
  sortIconS:string='date'
  constructor() { }

  ngOnInit(): void {
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

  sel(a:string, b:number){
    if(this.list[b].sel==0 || this.list[b].sel==null || this.list[b].sel==undefined){
      this.list.forEach((e:any) => {
        e.sel=0
      });
      this.list[b].sel=1
      this.select.emit(this.list[b].sjid)
    } else {
      this.list.forEach((e:any) => {
        e.sel=0
      })
      this.select.emit('')
    }
  }
}
