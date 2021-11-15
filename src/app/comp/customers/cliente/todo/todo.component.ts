import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SaveaccountComponent } from '../../../util/dialog/saveaccount/saveaccount.component'
import { GetPotYearService } from '../../../../serv/get-pot-year.service'
export interface customer{
  id: string,
  c1: string,
  c2: string,
  c3: string
}

@Component({
  selector: 'episjob-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  
  @Input() custId:string=''
  constructor() { 
    
  }

  ngOnInit(): void {
    
  }

  

}
