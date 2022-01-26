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
      let url:string= 'https://episjobreq.herokuapp.com/psdllp' //'http://localhost:3001/psdllp'
      let params = new HttpParams()
      .set('child',this.getH.getQ(a.date))
      .set("parts",partArr.toString())
      this.http.get(url,{params:params}).subscribe(gt=>{
        let total:number=0
        Object.values(gt).forEach(fr=>{
          let index:number=a.Parts.map((r:any)=>{return r.pn}).indexOf(fr.pn)
          a.Parts[index].llp=fr.llp
          a.Parts[index].tot=Math.round(fr.llp * a.Parts[index].qty*100)/100
          total+=a.Parts[index].tot
        })
        a.Parts['totAmount']=total
        //})
        //console.log(a.Parts.map((r:any)=>{return r.pn}).indexOf())
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
  }

  ngOnChanges(){
    this.reqlist.reverse()
  }

}
