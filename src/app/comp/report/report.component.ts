import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'episjob-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  test(){
    this.http.get('api/status').subscribe(a=>{
      console.log(a)
    })
  }
}
