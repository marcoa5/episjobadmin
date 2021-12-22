import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'episjob-requestlist',
  templateUrl: './requestlist.component.html',
  styleUrls: ['./requestlist.component.scss']
})
export class RequestlistComponent implements OnInit {
  @Input() sn:string=''
  partList: any[]=[]
  pn:any
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.sn==''){
      this.partList=[]
    }
  }

  add(a:string){
    this.partList.push(a)

  }

}
