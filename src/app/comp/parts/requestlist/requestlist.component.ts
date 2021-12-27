import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import firebase from 'firebase/app'
@Component({
  selector: 'episjob-requestlist',
  templateUrl: './requestlist.component.html',
  styleUrls: ['./requestlist.component.scss']
})
export class RequestlistComponent implements OnInit {
  @Input() sn:string=''
  partList: any[]=[]
  pn:any
  appearance: MatFormFieldAppearance = 'fill'
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.sn==''){
      this.partList=[]
    }
  }
}
