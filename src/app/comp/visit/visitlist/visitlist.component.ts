import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import * as moment from 'moment'
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/deldialog/deldialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'episjob-visitlist',
  templateUrl: './visitlist.component.html',
  styleUrls: ['./visitlist.component.scss']
})
export class VisitlistComponent implements OnInit {
  @Input() day:string=''
  @Input() pos:string=''
  today:string=moment(new Date()).format('DD/MM/YYYY')
  constructor(private router: Router, private dialog:MatDialog, private route:ActivatedRoute) { }

  ngOnInit(): void {
    
  }

  ngOnChanges():void{
    this.today=moment(new Date(this.day)).format('DD/MM/YYYY')
  }

  newV(){
    this.router.navigate(['newvisit'])
  }
}