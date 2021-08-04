import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field'
@Component({
  selector: 'episjob-newvisit',
  templateUrl: './newvisit.component.html',
  styleUrls: ['./newvisit.component.scss']
})
export class NewvisitComponent implements OnInit {
  newV: FormGroup;
  appearance:MatFormFieldAppearance="fill"

  constructor(private fb: FormBuilder) {
    this.newV = fb.group({
      date: new FormControl({value: new Date(),},Validators.required)
    })
  }

  ngOnInit(): void {
    this.newV.controls.date.setValue(new Date())
  }

}
