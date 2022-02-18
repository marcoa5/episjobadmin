import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { GetquarterService } from 'src/app/serv/getquarter.service';

@Component({
  selector: 'episjob-partsereq',
  templateUrl: './partsereq.component.html',
  styleUrls: ['./partsereq.component.scss']
})
export class PartsereqComponent implements OnInit {
  @Input() _reqlist:any[]=[]
  @Input() pos:string=''
  @Input() sortParts:boolean=true
  __reqlist:any[]=[]
  reqlist:any[]=[]
  constructor(private http: HttpClient, private getH: GetquarterService) { }

  ngOnInit(): void {
    this.__reqlist=this._reqlist
    .map(a=>{
      let partArr:string[]=[]
      a.Parts.forEach((e:any) => {
        partArr.push(e.pn)
      })
      let url:string= 'http://localhost:3001'
      //let url: string='https://episjobreq.herokuapp.com'
      let params = new HttpParams()
      .set('child',this.getH.getQ(a.date))
      .set("parts",partArr.toString())
      this.http.get(url + '/psdllp',{params:params}).subscribe(gt=>{
        let total:any=0
        a.Parts.forEach((fr:any)=>{
          let index = Object.values(gt).map(y=>{return y.pn}).indexOf(fr.pn)
          if(index>-1) {
            fr.llp=Object.values(gt)[index].llp
            fr.tot=Math.round(fr.llp * fr.qty*100)/100
            total+=fr.tot
          }
        })
        a.Parts['totAmount']=parseFloat(total)
      })
      a.date = moment(a.date).format('DD/MM/YY')
      return a
    })
    .sort((a: any, b: any) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      } else {
        return 0;
      }
    });
    this.reqlist=this.__reqlist
    console.log(this.reqlist)
  }

  ngOnChanges(){
    this.reqlist.reverse()
  }

}
