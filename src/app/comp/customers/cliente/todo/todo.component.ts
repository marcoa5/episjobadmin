import { Component, OnInit, Input } from '@angular/core';
export interface customer{
  id: string,
  c1: string,
  c2: string,
  c3: string
}

@Component({
  selector: 'episjob-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  
  @Input() custId:string=''
  constructor() { 
    
  }

  ngOnInit(): void {
    
  }

  

}
