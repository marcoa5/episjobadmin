import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';


@Component({
  selector: 'episjob-rig-table',
  templateUrl: './rig-table.component.html',
  styleUrls: ['./rig-table.component.scss']
})
export class RigTableComponent implements OnInit {
  @Input() dataSource:any
  @Input() pos:string=''
  @Output() action1 = new EventEmitter()
  @Output() action2 = new EventEmitter()
  displayedColumns: string[] = ['Date', 'Engine', 'Perc1', 'Perc2', 'Perc3'];
  ore:any
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(){
    this.ore = this.dataSource.map((i: { x:any,y: any; y1: any; y2: any; y3: any; })=>{
      return {
        x: i.x,
        y: this.th(i.y),
        y1: this.th(i.y1),
        y2: this.th(i.y2),
        y3: this.th(i.y3),
      }
    })
  }

  up(a:any,b:any,c:any){
    this.action1.emit([a,b,c])
  }

  de(a:string){
    this.action2.emit(a)
  }

  th(a:any){
    if(a==0) return '0'
    if(a){
      a=a.toString()
    let b = a.toString().length
    if(b<4) return a
    if(b>3 && b<7) return `${a.substring(0,b-3)}.${a.substring(b-3,b)}`
    if(b>6 && b<10) return `${a.substring(0,b-6)}.${a.substring(b-6,b-3)}.${a.substring(b-3,b)}`
    }
  }
}
