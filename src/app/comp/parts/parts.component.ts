import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewpartsrequestComponent } from './newpartsrequest/newpartsrequest.component';

@Component({
  selector: 'episjob-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  snr:string=''
  info:any|undefined
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }


  start(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    this.info=undefined
    const dialogRef = this.dialog.open(NewpartsrequestComponent, {
      data: {info: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        this.info=result
      }
    })
  }

  submit(e:any){
    console.log(this.info, e)
    alert('submit list')
  }
}
