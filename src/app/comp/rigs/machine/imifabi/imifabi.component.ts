import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment'
@Component({
  selector: 'episjob-imifabi',
  templateUrl: './imifabi.component.html',
  styleUrls: ['./imifabi.component.scss']
})
export class ImifabiComponent implements OnInit {
  @Input() list: any[]=[]
  _dettOre:any[]=[]
  dettOre:any[]=[]
  displayedColumns:string[]=['Date', 'Family', 'Hours']
  inizio:number = 1
  fine: number = 5
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.list.length>0){
      this.list.map(x=>{
        if(x.imiFabi) {
          let r = x.data11
          let anno = r.substring(6,10)
          let giorno = r.substring(0,2)
          let mese = r.substring(3,5)-1
          let d = moment(new Date(anno, mese, giorno)).format('YYYY-MM-DD')
          let ore = x.imiFabi.split('@')
          ore.pop()
          ore.map((g: string)=>{
            let f = g.split(';')
            this._dettOre.push({data:d, fam: f[0], hrs: f[1]})
          })

        }
      })
      this._dettOre.reverse()
      this.dettOre = this._dettOre.slice(this.inizio-1,this.fine)
    }
    
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize +1
    this.fine = this.inizio + e.pageSize-1
    this.dettOre = this._dettOre.slice(this.inizio-1,this.fine)
  }

}
