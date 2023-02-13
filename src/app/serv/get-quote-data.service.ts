import { Injectable } from '@angular/core';
import { NotifService } from './notif.service';
import firebase from 'firebase/app'
import { Observable } from 'rxjs'
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class GetQuoteDataService {
  actualFees: any = {}
  actualDiscount:any={}
  constructor(private notif:NotifService) { }

  getFees(rawData: any) {
    return new Promise((res, rej) => {
      firebase.database().ref('Contracts').child('active').child(rawData.matricola).once('value', a => {
        if(a.val()!=null){
          a.forEach(b => {
            if(b.val()!=null){
              b.forEach(c => {
                if (c.val().fees != null) {
                  this.actualFees = c.val().fees
                  res(c.val().fees)
                } else {
                  this.getStdFees().subscribe((re:any)=>{
                    this.actualFees = re
                    res(re)
                  })
                }
              })
            } else{
              this.getStdFees().subscribe((re:any)=>{
                this.actualFees = re
                res(re)
              })
            }
          })
        } else{
          this.getStdFees().subscribe((re:any)=>{
            this.actualFees = re
            res(re)
          })
        }
      })
    })
  }

  getStdFees(){
    return new Observable(sub=>{
      firebase.database().ref('Contracts').child('stdFees').once('value',a=>{
        if(a.val()!=null) sub.next(a.val())
      })
    })
  }

  getDiscount(rawData:any){
    return new Promise((res, rej) => {
      firebase.database().ref('Contracts').child('active').child(rawData.matricola).once('value', a => {
        if(a.val()!=null){
          a.forEach(b => {
            if(b.val()!=null){
              b.forEach(c => {
                if (c.val().discounts != null) {
                  this.actualDiscount = c.val().discounts
                  res(c.val().discounts)
                } else {
                  this.getStdDiscount().subscribe(re=>{
                    this.actualDiscount = re
                    res(re)
                  })
                }
              })
            } else{
              this.getStdDiscount().subscribe(re=>{
                this.actualDiscount = re
                res(re)
              })
            }
          })
        } else{
          this.getStdDiscount().subscribe(re=>{
            this.actualDiscount = re
            res(re)
          })
        }
      })
    })
  }

  getStdDiscount(){
    return new Observable(sub=>{
      firebase.database().ref('Contracts').child('stdDiscount').once('value',a=>{
        if(a.val()!=null) sub.next(a.val())
      })
    })
  }

  async generateQuote(rawData: any) {
    await this.getFees(rawData)
    await this.getDiscount(rawData)
    return new Promise((res, rej) => {
      let custC = new Observable(sub => {
        firebase.database().ref('MOL').child(rawData.matricola).once('value').then(a => {
          if (a.val()) {
            firebase.database().ref('CustomerC').child(a.val().custid).once('value', b => {
              if (b.val().code != null) {
                sub.next(b.val().code)
              } else {
                sub.next('')
              }
            })
          }
        })
      })
      let shipto = new Observable(sub2 => {
        firebase.database().ref('shipTo').child(rawData.matricola).once('value', l => {
          if (l.val() != null) {
            sub2.next(l.val().address)
          } else {
            sub2.next('')
          }
        })
      })
      let macItNr = new Observable(sub => {
        firebase.database().ref('MOL').child(rawData.matricola).child('in').once('value', t => {
          if (t.val() != null) {
            sub.next(t.val())
          } else {
            sub.next('')
          }
        })
      })

      let items = new Observable(sub => {
        let itemsData:any={}
        sub.next(itemsData)
      })

      custC.subscribe((r: any) => {
        shipto.subscribe((s: any) => {
          if (s != '') s = s.split(' - ')
          items.subscribe((i: any) => {
            macItNr.subscribe((m: any) => {
              let splitAir = this.actualDiscount['air transport'].split('% + ')
              let transAirP:number = parseFloat(splitAir[0])
              let transAirF:number = parseFloat(splitAir[1])
              let splitTruck = this.actualDiscount['truck transport'].split('% + ')
              let transTruckP:number = parseFloat(splitTruck[0])
              let transTruckF:number = parseFloat(splitTruck[1])
              let info: any = {
                a100custCode: r,
                a110data: moment(new Date()).format('DD/MM/YYYY'),
                a120docBPCS: 'test',
                a130shipTo1: rawData.cliente11,
                a140shipTo2: s[0] ? s[0] : '',
                a150shipTo3: s[1] ? s[1] : '',
                a160shipTo4: s[2] ? s[2] : '',
                a170customer1: rawData.cliente11,
                a180customer2: rawData.cliente12,
                a190customer3: rawData.cliente13,
                a200yourRef: rawData.vsordine ? rawData.vsordine : '',
                a210ourRef: '',
                a220terms: '',
                a230rig: rawData.prodotto1 + ' s.n. ' + rawData.matricola + (m != '' ? ' (' + m.toString().substring(0, 4) + '.' + m.toString().substring(4, 8) + '.' + m.toString().substring(8, 10) + ')' : ''),
                __psdDiscount:this.actualDiscount['PSD Discount']?this.actualDiscount['PSD Discount']:'0',
                __rdtDiscount:this.actualDiscount['RDT Discount']?this.actualDiscount['RDT Discount']:'0',
                __transAirF: transAirF,
                __transAirP: transAirP,
                __transTruckF: transTruckF,
                __transTruckP: transTruckP,
                __type:'Air',
              }
              Object.keys(i).forEach(it => {
                info[it] = i[it]
              })
              this.loadUserIds().subscribe((users:any)=>{
                this.notif.newNotification(users,'New Quote', `New Quote for ${rawData.prodotto1} - ${rawData.matricola} (${rawData.cliente11})`,'','_newquote','quotes,{}')
              })
              res(info)
            })
          })
        })
      })
    })
  }

  loadUserIds(){
    let users:any[]=[]
    return new Observable(sub=>{
      firebase.database().ref('Users').once('value',a=>{
        a.forEach(b=>{
          if((b.val().Pos=='SU' || b.val().Pos=='admin' || b.val().Pos=='adminS') && b.val()._newquotes=='1'){
            if(b.key) users.push(b.key)
          }
        })
      })
      .then(()=>{
        sub.next(users)
      })
    })
  }
}
