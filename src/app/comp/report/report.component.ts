import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import * as moment from 'moment'

@Component({
  selector: 'episjob-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  rigs:any[]=[]
  mac: any
  constructor() { }

  ngOnInit(): void {

  }

  all(){
    firebase.database().ref('MOL').once('value',a=>{
      //this.rigs = Object.values(a.val())
      Object.keys(a.val()).map(b=>{
        firebase.database().ref('Hours/'+b).limitToLast(1).once('value',c=>{
          let g, lastread, ore:any
          if (c.val()!=null) {
            ore = Object.values(c.val())[0]
            g = Object.keys(c.val())[0]
            let f = `${g.substring(0,4)}-${g.substring(4,6)}-${g.substring(6,8)}`
            lastread = moment(new Date(f)).format('DD/MM/YYYY')
          }
          this.rigs.push({
            sn: a.val()[b].sn,
            in: a.val()[b].in,
            site: a.val()[b].site,
            model: a.val()[b].model,
            customer: a.val()[b].customer,
            lastread: lastread?lastread:'',
            orem: lastread?ore.orem:'',
            perc1: lastread?ore.perc1:'',
            perc2: lastread?ore.perc2:'',
            perc3: lastread?ore.perc3:'',
          })
        })
      })
    })
  }
  
}
