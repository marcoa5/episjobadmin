import { Component, Input, OnInit } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { VisitdetailsComponent } from 'src/app/comp/util/dialog/visitdetails/visitdetails.component';

@Component({
  selector: 'episjob-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {
  @Input() list:any=[]
  
  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  openVisit(a:any){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(VisitdetailsComponent, {
      data: a
    });
  }

}
