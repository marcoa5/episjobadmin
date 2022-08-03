import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckwidthService } from 'src/app/serv/checkwidth.service';


@Component({
  selector: 'episjob-sumenu',
  templateUrl: './sumenu.component.html',
  styleUrls: ['./sumenu.component.scss']
})
export class SumenuComponent implements OnInit {
  @Input() sent:boolean=false
  sumenu!:FormGroup
  
  constructor(private ch:CheckwidthService, private fb: FormBuilder) { 
    this.sumenu=fb.group({
      commessa:[''],
      nsofferta:[''],
      vsordine:[''],
      dateBPCS:['', Validators.required],
      closeBPCS:[''],
      docBPCS:['', [Validators.required, Validators.pattern(/^[0-9]{6,6}/)]]
    })
  }

  ngOnInit(): void {
  }

  chLen(e:any){
    if(e.target.value.length==6 && e.key!="Backspace" && e.key!="Delete" && e.key!='ArrowLeft' && e.key!='ArrowRight') return false
    return true
  }

  chW(){
    return this.ch.isTouch()
  }
}
