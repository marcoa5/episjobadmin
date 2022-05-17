import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'episjob-workshopfiles',
  templateUrl: './workshopfiles.component.html',
  styleUrls: ['./workshopfiles.component.scss']
})
export class WorkshopfilesComponent implements OnInit {
  @Input() list:any[]=[]
  _list:any[]=[]
  inizio: number = 0
  fine: number = 5
  displayedColumns:string[]=[]
  constructor() { }

  ngOnInit(): void {
    console.log(this.list)
    this.onResize()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<800){
      this.displayedColumns=['type', 'sn', 'hrs']
    } else {
      this.displayedColumns=['type', 'sn', 'hrs', 'from','to']
    }
  }

  ngOnChanges(){
    this.list.sort((a:any,b:any)=>{
      if(a.cat>b.cat) return 1
      if(a.cat<b.cat) return -1
      return 0
    })
    this._list = this.list.slice(this.inizio,this.fine)
  }

  open(a:any){}

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    this._list = this.list.slice(this.inizio,this.fine)
  }

}
