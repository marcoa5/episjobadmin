import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import firebase from 'firebase/app';
import * as XLSX from 'xlsx'
import { validateBasis } from '@angular/flex-layout';

@Component({
  selector: 'episjob-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  users: any[]=[]
  sns:any[]=[]
  ths:any[]=[]
  constructor() { }

  ngOnInit(): void {
    firebase.database().ref('Hours').once('value',a=>{
      console.log(JSON.parse(a.val()))
      const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(Object.values(a.val()))
      const wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Export')
      XLSX.writeFile(wb, 'test.xlsx')

      /*let len = a.val()
      a.forEach(b=>{
        b.forEach(c=>{
          this.sns.push({
            matricola:b.key,
            data:new Date(moment(c.key).format('YYYY-MM-DD')),
            orem:c.val().orem=='c'? 'Commissioning': c.val().orem,
            perc1:c.val().orem=='c'? '': c.val().perc1,
            perc2:c.val().orem=='c'? '': c.val().perc2,
            perc3:c.val().orem=='c'? '': c.val().perc3,
          })
          this.ths=['Serial nr','Date','Eng Hrs', 'Perc 1', 'Perc 2', 'Perc 3']
        })
      })*/
    })
  }

  report(){
    

  }
  
}
