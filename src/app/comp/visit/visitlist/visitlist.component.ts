import { Component, OnInit } from '@angular/core';
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
  pos:string=''
  userId:String=''
  visits: any=[]
  month:string=''
  days:any[]=[]
  _days:any[]=[]
  dailyList:any[]=[]
  today:string=moment(new Date()).format('DD/MM/YYYY')
  m:any = {m: new Date().getMonth()+1,y: new Date().getFullYear(), ext:moment(new Date()).format('MMMM YYYY')}
  chDailyList:boolean=false

  constructor(private router: Router, private dialog:MatDialog, private route:ActivatedRoute) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        firebase.database().ref('Users').child(a.uid).child('Pos').once('value',b=>{
          this.pos=b.val()
          this.userId=a.uid
        })
        .then(()=>{
          console.log(this.m.m,this.m.y)

          this.route.params.subscribe(a=>{
            
            if(a.date) {
              this.m.m=new Date(a.date).getMonth()+1
              this.m.y=new Date(a.date).getFullYear()
              this.m.ext=moment(new Date(a.date)).format('MMMM YYYY')
              this.today=moment(new Date(a.date)).format('DD/MM/YYYY')
              this.gio(new Date(a.date))
            } else {
              this.gio(new Date())
            }

          })
          this.giorni(this.m.m,this.m.y).then((a:any)=>this.days=a)
          
        })
      }
    })
    
  }

  giorni(m:number, y:number){
    this._days=[]
    this.dailyList=[]
    let i =new Date(y,m-1,1)
    let ch = i.getDay()-1>=0?i.getDay()-1:6
    let ch1 = new Date(y,m,0).getDate()
    return new Promise((res,rej)=>{
      for(let r=1; r<(i.getDay()==0?7:i.getDay());r++) this._days.push({n:'',day:'',visits:'' })
      for(let o = 1; o<new Date(y,m,0).getDate()+1;o++){
      this._days.push({n:o,day: new Date(y,m-1,o),visits:'', holy:dayType(new Date(y,m-1,o))})
      firebase.database().ref('CustVisit').child(moment(new Date(y,m-1,o)).format('YYYYMMDD')).once('value',a=>{
        a.forEach(b=>{
          if(this.pos=='sales' && this.userId==b.key?.substring(0,28)) this._days[o-1+ch].visits='ok'
          if(this.pos!='sales') this._days[o-1+ch].visits='ok'
        })
        //if(a.val()!=null) this._days[o-1+ch].visits='ok'
      })
      if(this._days.length == ch+ch1) {
        //console.log(this._days)
        res(this._days)
      }
      }
    })  
  }

  gio(d:Date){
    this.chDailyList=false
    this.dailyList=[]
    if(d!=undefined) {
      this.today=moment(d).format('DD/MM/YYYY')
      firebase.database().ref('CustVisit').child(moment(d).format('YYYYMMDD')).once('value',a=>{
        if(a.val()!=null) {
          a.forEach(b=>{
            if(this.userId==b.key?.substring(0,28) && this.pos=='sales'){
              b.forEach(c=>{
                this.dailyList.push(c.val())
              })
            } else if(this.pos=='SU' || this.pos=='adminS'){
              b.forEach(c=>{
                let g= c.val()
                g.sam=b.key?.substring(29,1000)
                g.a1=a.key
                g.a2=b.key
                g.a3=c.key
                this.dailyList.push(g)
              })
            }
          })
        }
      })
      .then(()=>{
        this.chDailyList=true;
      })
    }
  }

  moveMonth(a:string){
    let data = new Date(this.m.y,this.m.m-1,1)
    let currM = moment(new Date()).format('MM')
    if(a=='+') {
      this.m.m = moment(new Date(data)).add(1,'months').format('MM')
      this.m.y=moment(new Date(data)).add(1,'months').format('YYYY')
      this.m.ext = moment(new Date(data)).add(1,'months').format('MMMM YYYY')
      
    }
    if(a=='-') {
      this.m.m = moment(new Date(data)).add(-1,'months').format('MM')
      this.m.y=moment(new Date(data)).add(-1,'months').format('YYYY')
      this.m.ext = moment(new Date(data)).add(-1,'months').format('MMMM YYYY')
      
    }
    this.giorni(this.m.m,this.m.y)    
    .then((a:any)=>{
      this.days=a
      if(currM==this.m.m) {
        this.today = moment(new Date()).format('DD/MM/YYYY')
        this.gio(new Date())
      } else {
        this.today = moment(new Date(this.m.y, this.m.m-1,1)).format('DD/MM/YYYY')
        this.gio(new Date(this.m.y, this.m.m-1,1))
      }
      
    })
  }

  aa():boolean{
    const box = document.querySelector('.calCont')
    if(box && box.clientWidth<400) return true
    return false
  }

  newVisit(a:string){
    let d = a.substring(0,2)
    let m = a.substring(3,5)
    let y= a.substring(6,10)
    let da = y+'-'+m+'-'+d
    this.router.navigate(['newvisit',{date:da}])
  }

  chDay(a:Date):boolean{
    if(moment(a).format('DD/MM/YYYY')==this.today) return true
    return false
  }

  deleteVisit(a:any, t:String){
    let d = parseInt(t.substring(0,2))
    let m = parseInt(t.substring(3,5))
    let y = parseInt(t.substring(6,10))

    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {name: 'Visit to ' + a.c1}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        firebase.database().ref('CustVisit').child(a.a1).child(a.a2).child(a.a3).remove()
        this.giorni(m,y).then((a:any)=>{
        this.days=a
        this.today=moment(new Date(y,m-1,d)).format('DD/MM/YYYY')
    })
      }
    })
    
  }
}

function dayType(a: any): any{
  let y = parseInt(moment(a).format('YYYY'))
  let holy: string[]=[
    moment(new Date(y, 0,1)).format('YYYY-MM-DD'),
    moment(new Date(y,0,6)).format('YYYY-MM-DD'),
    moment(new Date(y,3,25)).format('YYYY-MM-DD'),
    moment(new Date(y,4,1)).format('YYYY-MM-DD'),
    moment(new Date(y,5,2)).format('YYYY-MM-DD'),
    moment(new Date(y,7,15)).format('YYYY-MM-DD'),
    moment(new Date(y,10,1)).format('YYYY-MM-DD'),
    moment(new Date(y,11,8)).format('YYYY-MM-DD'),
    moment(new Date(y,11,24)).format('YYYY-MM-DD'),
    moment(new Date(y,11,25)).format('YYYY-MM-DD'),
    moment(new Date(y,11,26)).format('YYYY-MM-DD'),
    moment(new Date(y,11,31)).format('YYYY-MM-DD'),
  ]
  holy.push(moment(Easter(y)).format('YYYY-MM-DD'))
  holy.push(moment(new Date(moment(Easter(y)).add(1,'days').format('YYYY-MM-DD'))).format('YYYY-MM-DD'))
  if(holy.includes(moment(a).format('YYYY-MM-DD'))) return false

  if(a.getDay()==0) return false
  return true
  
}

function Easter(Y:number):Date {
  var C = Math.floor(Y/100);
  var N = Y - 19*Math.floor(Y/19);
  var K = Math.floor((C - 17)/25);
  var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
  I = I - 30*Math.floor((I/30));
  I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
  var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
  J = J - 7*Math.floor(J/7);
  var L = I - J;
  var M = 3 + Math.floor((L + 40)/44);
  var D = L + 28 - 31*Math.floor(M/4);
  return new Date(Y,M-1,D)
}