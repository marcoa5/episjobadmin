import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'episjob-sumenu',
  templateUrl: './sumenu.component.html',
  styleUrls: ['./sumenu.component.scss']
})
export class SumenuComponent implements OnInit {
  @Input() sent:boolean=false
  sumenu!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  constructor(private fb: FormBuilder) { 
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
}
