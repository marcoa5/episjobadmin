import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import * as moment from 'moment'


@Component({
  selector: 'episjob-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(new Date(moment(new Date()).days(-90).format('YYYY, MM, DD'))),
    end: new FormControl(new Date())
  });

  buttons:any=[
    {label: '3M', fun: {v: 3, l: 'months'}},
    {label: '6M', fun: {v: 6, l: 'months'}},
    {label: '1Y', fun: {v: 1, l: 'years'}},
    {label: '5Y', fun: {v: 5, l: 'years'}},
    {label: 'All', fun: {v: '', l: ''}},
  ]
  @Input() valore:string=''
  @Input() pos:string=''
  @Input() inizio:any
  @Output() date = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }

  ran(a:any, b:FormGroup){
    let nw=''
    if(a.v!='') {
      nw = moment(this.range.value.end).subtract(a.v,a.l).format('YYYY-MM-DD')
    } else {
      nw=moment(this.inizio).format('YYYY-MM-DD')
    }
    b.get('start')?.setValue(nw)
    this.avv(this.range.value.start,this.range.value.end)
  }

  avv(a:any,b:any){
    this.date.emit([new Date(a),new Date(b)])
  }

}