import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { DaytypesjService } from 'src/app/serv/daytypesj.service';

@Component({
  selector: 'episjob-newday',
  templateUrl: './newday.component.html',
  styleUrls: ['./newday.component.scss']
})
export class NewdayComponent implements OnInit {
  subsList:Subscription[]=[]
  tech:any[]=[]
  appearance:MatFormFieldAppearance='fill'
  newDay!:FormGroup
  dayType:string=''
  constructor(private auth: AuthServiceService, public dialogRef: MatDialogRef<NewdayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private getday:DaytypesjService,
    ) { 
      this.newDay=fb.group({
        date:['', Validators.required],
        tech: ['', Validators.required],
        spov: [''],
        spol: [''],
        spsv: [''],
        spsl: [''],
        /*stdv: [''],
        stdl: [''],
        strv: [''],
        strl: [''],*/
        mntv: [''],
        mntl: [''],
        mfv:[''],
        mfl:[''],
        mnfv:[''],
        mnfl:[''],
        km:[''],
        spv:[''],
        off:[''],
        ofs:['']
      })
    }

  ngOnInit(): void {
    console.log(this.data)
    this.subsList.push(
      this.auth._tech.subscribe(a=>{
        if(a) this.tech=a
      })
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  newDate(){
    let a=this.newDay.controls.date.value
    this.dayType = this.getday.dayType(a)
  }
  
}
