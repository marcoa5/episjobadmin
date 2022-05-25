import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-templist',
  templateUrl: './templist.component.html',
  styleUrls: ['./templist.component.scss']
})
export class TemplistComponent implements OnInit {
  @Input() list:any[]=[]
  tempList:any[]=[]
  spin:boolean=false
  sortedData:any[]=[]
  constructor() { }
  displayedColumns:string[]=['file','model','customer','day','v1','v2','v8','app','rej']
  ngOnInit(): void {
    
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<850){
      this.displayedColumns=['file','day','v1','v2','v8','app','rej']
    } else{
      this.displayedColumns=['file','model','customer','day','v1','v2','v8','app','rej']
    }
  }

  ngOnChanges(){
      this.onResize()
      this.spin=true
      console.log(this.list.length)
      if(this.list.length>0 && this.list[0]!=null){
        this.list.forEach(a=>{
          this.tempList=[]
          Object.keys(a).forEach(b=>{
            let r:any=Object.values(a)[Object.keys(a).indexOf(b)]
            Object.keys(r).forEach(c=>{
              let t:any=Object.values(r)[Object.keys(r).indexOf(c)]
              if(t.days){
                Object.keys(t.days).forEach(d=>{
                  let y:any=Object.values(t.days)[Object.keys(t.days).indexOf(d)]
                  firebase.database().ref('wsFiles').child('open').child(b).child(c).once('value',gt=>{
                    if(y.lock){
                      let temp:any={file:gt.val().file,model:gt.val().model,customer:gt.val().customer,day:d,v1:y.v1?y.v1:0,v2:y.v2?y.v2:0,v8:y.v8?y.v8:0,id:c,sn:gt.val().sn}
                      this.tempList.push(temp) 
                    }
                  })
                })
              }
            })
          })
        })
      } else {
        this.tempList=[]
        this.spin=false
      }
      
    setTimeout(() => {
      this.sortedData=this.tempList.slice()
      this.spin=false
    }, 250);
  }

  sortData(sort: Sort) {
    const data = this.tempList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'model':
          return compare(a.model, b.model, isAsc);
        case 'customer':
          return compare(a.customer, b.customer, isAsc);
        case 'file':
          return compare(a.file, b.file, isAsc);
        case 'day':
          return compare(a.day, b.day, isAsc);
        case 'v1':
          return compare(a.v1, b.v1, isAsc);
        case 'v2':
          return compare(a.v2, b.v2, isAsc)
        case 'v8':
          return compare(a.v8, b.v8, isAsc)
        default:
          return 0;
      }
    });
  }

  total(type:string){
    return this.sortedData.map((a:any)=>a[type]).reduce((a,b)=>a+b,0)
  }

  fil(e:any){
    let filter:any=e.toLowerCase()
    this.sortedData=this.tempList.filter(a=>{
      if(a.file.toLowerCase().includes(filter)) return a
      return false
    })
  }

  approve(e:any,i:number){
    let ref=firebase.database().ref('wsFiles')
    ref.child('temp').child(e.sn).child(e.id).child('days').child(e.day).once('value',s=>{
      ref.child('open').child(e.sn).child(e.id).child('days').child(e.day).set(s.val())
      .then(()=>{
        ref.child('temp').child(e.sn).child(e.id).child('days').child(e.day).remove()
        .then(()=>this.sortedData.splice(i,1))
      })
    })
  }

  reject(e:any,i:number){
    let ref=firebase.database().ref('wsFiles')
    ref.child('temp').child(e.sn).child(e.id).child('days').child(e.day).remove()
    .then(()=>this.sortedData.splice(i,1))
  }
  
  

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}