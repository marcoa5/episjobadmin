import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import firebase from 'firebase/app';
import 'firebase/database'

@Component({
  selector: 'episjob-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  users: any[]=[]
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  test(){
    this.http.get('api/getusers').subscribe(a=>{
      console.log(a)
    })
  }
}
