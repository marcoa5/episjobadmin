import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'episjob-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  checkSn:boolean=false
  snr:string=''
  constructor() { }

  ngOnInit(): void {
  }

  sn(e:any){
    if(e!='') {
      this.checkSn=true
      this.snr=e
    } else{
      this.checkSn=false
      this.snr=''
    }
  }
}
