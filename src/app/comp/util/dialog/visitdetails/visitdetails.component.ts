import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { DeldialogComponent } from '../../deldialog/deldialog.component'
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-visitdetails',
  templateUrl: './visitdetails.component.html',
  styleUrls: ['./visitdetails.component.scss']
})
export class VisitdetailsComponent implements OnInit {
  val:any[]=[]
  notes:any={}
  url:string = ''
  constructor(public dialogRef: MatDialogRef<VisitdetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog:MatDialog) { 
    
  }

  ngOnInit(): void {
    
    this.val=[
      {lab: 'Customer Name', value: this.data.c1, click:''},
      {lab: 'Contact', value: this.data.name, click:''},
      {lab: 'Place', value: this.data.place, click:''},
      //{lab: 'Notes', value: this.data.notes, click:''},
    ]
    this.notes={lab: 'Notes', value: this.data.notes}
    this.url = this.data.url
  }

  onNoClick(){
    this.dialogRef.close();
  }
  
  del(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {name: this.url, desc: 'Visit'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        firebase.database().ref('CustVisit').child(result).remove()
        .then(()=>this.dialogRef.close('delete'))
        .catch(err=>this.dialogRef.close())
      }
    });
  }
}
