import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'episjob-customsnack',
  templateUrl: './customsnack.component.html',
  styleUrls: ['./customsnack.component.scss']
})
export class CustomsnackComponent implements OnInit {

  constructor(public snackBarRef: MatSnackBarRef<CustomsnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any, private router:Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.snackBarRef.dismiss()
    }, 8000);
  }

  go(){
    let a = this.data.data.act.split(',')[0]
    let b= JSON.parse(this.data.data.act.split(',')[1])
    this.snackBarRef.dismiss()
    this.router.navigate([a,b])
  }

}
