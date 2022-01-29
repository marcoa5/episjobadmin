import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'episjob-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.scss']
})
export class SpinComponent implements OnInit {
  @Input() padtop:number=100
  constructor() { }

  ngOnInit(): void {
  }

}
