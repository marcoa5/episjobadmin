import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() sortDA:boolean = true
  ore:any[]=[]
  oreSl:any[]=[]
  displayedColumns: string[]=['Date', 'Engine']
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(){
    this.displayedColumns=['Date', 'Engine']
    this.dataSource.reverse()
    this.ore = this.dataSource.map((i: { x:any,y: any; y1: any; y2: any; y3: any; })=>{
      return {
        x: i.x,
        y: this.th(i.y),
        y1: this.th(i.y1),
        y2: this.th(i.y2),
        y3: this.th(i.y3),
      }
    })
    if(this.ore.length>0){
      if(this.ore[0].y=='c') this.ore[0].y=0
      if(this.ore[0].y1=='c') this.ore[0].y1=0
      if(this.ore[0].y2=='c') this.ore[0].y2=0
      if(this.ore[0].y3=='c') this.ore[0].y3=0
      if((this.ore[1] && this.ore[1].y1!=undefined && this.ore[1].y1!='0') || (this.ore[0].y1!='0' && this.ore[0].y1!=undefined)) this.displayedColumns.push('Perc1')
      if((this.ore[1] && this.ore[1].y2!=undefined && this.ore[1].y2!='0') || (this.ore[0].y2!='0'  && this.ore[0].y2!=undefined)) this.displayedColumns.push('Perc2')
      if((this.ore[1] && this.ore[1].y3!=undefined && this.ore[1].y3!='0')|| (this.ore[0].y3!='0'  && this.ore[0].y3!=undefined)) this.displayedColumns.push('Perc3')
    }
    this.oreSl = this.ore//.slice(this.inizio-1,this.fine)
    
  }

  up(a:any,b:any,c:any){
    this.action1.emit([a!=undefined? a.replace(/\./g,''): 0,b,c])
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

  /*split(e:any){
    this.inizio = e.pageIndex * e.pageSize +1
    this.fine = this.inizio + e.pageSize-1
    this.oreSl = this.ore.slice(this.inizio-1,this.fine)
  }*/
}
