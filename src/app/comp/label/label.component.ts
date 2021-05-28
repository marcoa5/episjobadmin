import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'episjob-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  constructor(private router:Router) { }
  @Input() values:any=[]
  
  ngOnInit(): void {
  }

  open(a:string, b:string){
    if(a && b=='machine') this.router.navigate(['/' + b,{sn:a}])
    if(a && b=='cliente') this.router.navigate(['/' + b,{cust1:a}])
  }

}
