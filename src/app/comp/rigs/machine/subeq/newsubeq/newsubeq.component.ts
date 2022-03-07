import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-newsubeq',
  templateUrl: './newsubeq.component.html',
  styleUrls: ['./newsubeq.component.scss']
})
export class NewsubeqComponent implements OnInit {
  items:any[]=[
    'Certiq','Engine','Rock Drill', 'Feed','Feed 1', 'Feed 2', 'Feed 3', 'El. Power (kW)'
  ]
  subsList:Subscription[]=[]
  rigs:any[]=[]
  label:string=''
  constructor(public dialogRef: MatDialogRef<NewsubeqComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private auth: AuthServiceService) {}

  ngOnInit(): void {
    if(this.data.transfer){
      this.subsList.push(
        this.auth._fleet.subscribe(a=>{
          if(a){
            this.items= a.map((b:any)=>{return b.sn})
            this.label='Serial nr.'
          }
        })
      )
    }
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
