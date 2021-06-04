import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
@Component({
  selector: 'episjob-add-cancelbuttons',
  templateUrl: './add-cancelbuttons.component.html',
  styleUrls: ['./add-cancelbuttons.component.scss']
})
export class AddCancelbuttonsComponent implements OnInit {
  @Input() a1:string|undefined
  @Input() a2:string|undefined
  @Input() type:string|undefined
  @Input() check:any[]=[]
  @Output() info = new EventEmitter()
  @Output() dele = new EventEmitter()
  @Input() del:boolean=false
  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  back(){
    this.location.back()
  }

  add(){
    if(this.type=='customer') this.info.emit('newc')
    if(this.type=='rig') this.info.emit('newr')
    if(this.type=='tech') this.info.emit('newt')
  }

  contr():boolean{
    if(this.check?.includes('')) return true
    return false
  }

  delete(){
    if(this.type=='tech') this.dele.emit('delete')
  }

}
