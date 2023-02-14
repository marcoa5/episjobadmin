import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'episjob-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.scss']
})
export class SpinComponent implements OnInit {
  @Input() padtop:number=100
  @Input() scale:number=1
  constructor() { }

  ngOnInit(): void {
  }

}
