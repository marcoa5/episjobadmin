import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'episjob-h2',
  templateUrl: './h2.component.html',
  styleUrls: ['./h2.component.scss']
})
export class H2Component implements OnInit {
  @Input() data:string|undefined
  @Input() padtop:any=35
  constructor() { }

  ngOnInit(): void {

  }

}
