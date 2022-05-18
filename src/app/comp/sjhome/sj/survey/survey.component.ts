import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'episjob-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  
  surveyForm!:FormGroup
  surveyList:string[]=[
    'Organizzazione Intervento:',
    'Consegna ricambi puntuale:',
    'Esecuzione intervento:'
  ]
  constructor(private fb:FormBuilder, public dialogRef: MatDialogRef<SurveyComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.surveyForm=fb.group({
      name: ['', Validators.required],
      a1:['',Validators.required],
      a2:['',Validators.required],
      a3:['',Validators.required],
    })
  }

  ngOnInit(): void {
    let r = this.surveyForm.controls
    r.name.setValue(this.data.name)
    if(this.data.rissondaggio!=''){
      r.a1.setValue(this.data.riss.substring(0,1))
      r.a2.setValue(this.data.riss.substring(1,2))
      r.a3.setValue(this.data.riss.substring(2,3))
    }
    
  }

  onNoClick(){
    this.dialogRef.close()
  }

  chW(){
    if(window.innerWidth<551) return true
    return false
  }


}
