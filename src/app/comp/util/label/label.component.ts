import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { NewcontactComponent } from '../dialog/newcontact/newcontact.component';

@Component({
  selector: 'episjob-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  constructor(private router:Router,public dialog: MatDialog) { }
  @Input() values:any[]=[]
  @Input() fillfit:string='fill'
  @Output() newCont=new EventEmitter()
  valuesN:any[]=[]
  ngOnInit(): void {
  }

  ngOnChanges(){
    this.valuesN=this.values
  }

  open(a:any, b:string){
    if(a && b=='machine') this.router.navigate(['/' + b,{sn:a}])
    if(a && b=='cliente') this.router.navigate(['/' + b,{id:a}])
    if(a && b=='contact') {
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(NewcontactComponent, {
        data: {id: a.custId, type: 'edit', info: a}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined) {
          this.newCont.emit(result)
        }
      })
    }

  }

}
