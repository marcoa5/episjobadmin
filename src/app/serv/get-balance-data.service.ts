import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { NotifService } from './notif.service';
@Injectable({
  providedIn: 'root'
})
export class GetBalanceDataService {
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
                  this.getStdFees().subscribe(re=>{
                    this.actualFees = re
                    res(re)
                  })
                }
              })
            } else{
              this.getStdFees().subscribe(re=>{
                this.actualFees = re
                res(re)
              })
            }
          })
        } else{
          this.getStdFees().subscribe(re=>{
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

  async generateBalance(rawData: any) {
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
        let mstdov: number = 0
        let mstdsv: number = 0
        let mstdol: number = 0
        let mstdsl: number = 0
        let mspeov: number = 0
        let mspesv: number = 0
        let mspeol: number = 0
        let mspesl: number = 0
        let mnotv: number = 0
        let mnotl: number = 0
        let mfv: number = 0
        let mfl: number = 0
        let mfnotv: number = 0
        let mfnotl: number = 0
        let km: number = 0
        let spv: number = 0
        let off: number = 0
        let ofs: number = 0
        let itemsData: any = {}
        for (let i = 1; i <= 7; i++) {
          if (rawData['dat' + i + '1'] != '' && rawData['dat' + i + '2'] != '' && rawData['dat' + i + '3'] != '') {
            if (rawData['spov' + i + '1'] != '') {
              mspeov += parseFloat(rawData['spov' + i + '1'])
              //if(mspeov>0) itemsData['mspeov']=mspeov
            }
            if (rawData['spol' + i + '1'] != '') {
              mspeol += parseFloat(rawData['spol' + i + '1'])
              //if(mspeol>0) itemsData['mspeol']=mspeol
            }
            if (rawData['spsv' + i + '1'] != '') {
              mspesv += parseFloat(rawData['spsv' + i + '1'])
              //if(mspesv>0) itemsData['mspesv']=mspesv
            }
            if (rawData['spll' + i + '1'] != '') {
              mspesl += parseFloat(rawData['spll' + i + '1'])
              //if(mspesl>0) itemsData['mspesl']=mspesl
            }
            if (rawData['stdv' + i + '1'] != '') {
              mstdov += parseFloat(rawData['stdv' + i + '1'])
              //if(mstdov>0) itemsData['mstdov']=mstdov
            }
            if (rawData['stdl' + i + '1'] != '') {
              mstdol += parseFloat(rawData['stdl' + i + '1'])
              //if(mstdol>0) itemsData['mstdol']=mstdol
            }
            if (rawData['strv' + i + '1'] != '') {
              mstdsv += parseFloat(rawData['strv' + i + '1'])
              //if(mstdsv>0) itemsData['mstdsv']=mstdsv
            }
            if (rawData['strl' + i + '1'] != '') {
              mstdsl += parseFloat(rawData['strl' + i + '1'])
              //if(mstdsl>0) itemsData['mstdsl']=mstdsl
            }
            if (rawData['mntv' + i + '1'] != '') {
              mnotv += parseFloat(rawData['mntv' + i + '1'])
              //if(mnotv>0) itemsData['mnotv']=mnotv
            }
            if (rawData['mntl' + i + '1'] != '') {
              mnotl += parseFloat(rawData['mntl' + i + '1'])
              //if(mnotl>0) itemsData['mnotl']=mnotl
            }
            if (rawData['mfv' + i + '1'] != '' && rawData['mfv' + i + '1'] != undefined) {
              mfv += parseFloat(rawData['mfv' + i + '1'])
              //if(mfv>0) itemsData['mfv']=mfv
            }
            if (rawData['mfl' + i + '1'] != '') {
              mfl += parseFloat(rawData['mfl' + i + '1'])
              //if(mfl>0) itemsData['mfl']=mfl
            }
            if (rawData['mnfv' + i + '1'] != '') {
              mfnotv += parseFloat(rawData['mnfv' + i + '1'])
              //if(mfnotv>0) itemsData['mfnotv']=mfnotv
            }
            if (rawData['mnfl' + i + '1'] != '') {
              mfnotl += parseFloat(rawData['mnfl' + i + '1'])
              //if(mfnotl>0) itemsData['mfnotl']=mfnotl
            }
            if (rawData['km' + i + '1'] != '') {
              km += parseFloat(rawData['km' + i + '1'])
              //if(km>0) itemsData['km']=km
            }
            if (rawData['spv' + i + '1'] != '') {
              spv += parseFloat(rawData['spv' + i + '1'])
              //if(spv>0) itemsData['spv']=spv
            }
            if (rawData['off' + i + '1'] != '') {
              off += parseFloat(rawData['off' + i + '1'])
              //if(off>0) itemsData['off']=off
            }
            if (rawData['ofs' + i + '1'] != '') {
              ofs += parseFloat(rawData['ofs' + i + '1'])
              //if(ofs>0) itemsData['ofs']=ofs
            }
          }
        }
        let check: number = 1
        if (mstdov) {
          itemsData['_ite' + check] = 'MANODOPERA STANDARD ORDINARIA VIAGGIO'
          itemsData['_qty' + check] = mstdov
          itemsData['_llp' + check] = this.actualFees.std?parseFloat(this.actualFees.std):''
          check++
        }
        if (mstdsv) {
          itemsData['_ite' + check] = 'MANODOPERA STANDARD STRAORDINARIA VIAGGIO'
          itemsData['_qty' + check] = mstdsv
          itemsData['_llp' + check] = this.actualFees.str?parseFloat(this.actualFees.str):''
          check++
        }
        if (mstdol) {
          itemsData['_ite' + check] = 'MANODOPERA STANDARD ORDINARIA LAVORO'
          itemsData['_qty' + check] = mstdol
          itemsData['_llp' + check] = this.actualFees.std?parseFloat(this.actualFees.std):''
          check++
        }
        if (mstdsl) {
          itemsData['_ite' + check] = 'MANODOPERA STANDARD STRAORDINARIA LAVORO'
          itemsData['_qty' + check] = mstdsl
          itemsData['_llp' + check] = this.actualFees.str?parseFloat(this.actualFees.str):''
          check++
        }
        if (mspeov) {
          itemsData['_ite' + check] = 'MANODOPERA SPECIALISTICA ORDINARIA VIAGGIO'
          itemsData['_qty' + check] = mspeov
          itemsData['_llp' + check] = this.actualFees.spo?parseFloat(this.actualFees.spo):''
          check++
        }
        if (mspesv) {
          itemsData['_ite' + check] = 'MANODOPERA SPECIALISTICA STRAORDINARIA VIAGGIO'
          itemsData['_qty' + check] = mspesv
          itemsData['_llp' + check] = this.actualFees.sps?parseFloat(this.actualFees.sps):''
          check++
        }
        if (mspeol) {
          itemsData['_ite' + check] = 'MANODOPERA SPECIALISTICA ORDINARIA LAVORO'
          itemsData['_qty' + check] = mspeol
          itemsData['_llp' + check] = this.actualFees.spo?parseFloat(this.actualFees.spo):''
          check++
        }
        if (mspesl) {
          itemsData['_ite' + check] = 'MANODOPERA SPECIALISTICA STRAORDINARIA LAVORO'
          itemsData['_qty' + check] = mspesl
          itemsData['_llp' + check] = this.actualFees.sps?parseFloat(this.actualFees.sps):''
          check++
        }
        if (mnotv) {
          itemsData['_ite' + check] = 'MANODOPERA NOTTURNA VIAGGIO'
          itemsData['_qty' + check] = mnotv
          check++
        }
        if (mnotl) {
          itemsData['_ite' + check] = 'MANODOPERA NOTTURNA LAVORO'
          itemsData['_qty' + check] = mnotl
          itemsData['_llp' + check] = this.actualFees.mnt?parseFloat(this.actualFees.mnt):''
          check++
        }
        if (mfv) {
          itemsData['_ite' + check] = 'MANODOPERA FESTIVA VIAGGIO'
          itemsData['_qty' + check] = mfv
          itemsData['_llp' + check] = this.actualFees.mf?parseFloat(this.actualFees.mf):''
          check++
        }
        if (mfl) {
          itemsData['_ite' + check] = 'MANODOPERA FESTIVA LAVORO'
          itemsData['_qty' + check] = mfl
          itemsData['_llp' + check] = this.actualFees.mf?parseFloat(this.actualFees.mf):''

          check++
        }
        if (mfnotv) {
          itemsData['_ite' + check] = 'MANODOPERA FESTIVA NOTTURNA VIAGGIO'
          itemsData['_qty' + check] = mfnotv
          itemsData['_llp' + check] = this.actualFees.mnf?parseFloat(this.actualFees.mnf):''
          check++
        }
        if (mfnotl) {
          itemsData['_ite' + check] = 'MANODOPERA FESTIVA NOTTURNA LAVORO'
          itemsData['_qty' + check] = mfnotl
          itemsData['_llp' + check] = this.actualFees.mnf?parseFloat(this.actualFees.mnf):''

          check++
        }
        if (spv) {
          itemsData['_ite' + check] = 'SPESE VIAGGIO'
          itemsData['_llp' + check] = spv
          itemsData['_qty' + check] = 1
          check++
        }
        if (km) {
          itemsData['_ite' + check] = 'CHILOMETRI'
          itemsData['_qty' + check] = km
          itemsData['_llp' + check] = this.actualFees.km?parseFloat(this.actualFees.km):''
          check++
        }
        if (off) {
          itemsData['_ite' + check] = 'MANODOPERA OFFICINA ORDINARIA'
          itemsData['_qty' + check] = off
          itemsData['_llp' + check] = this.actualFees.off?parseFloat(this.actualFees.off):''
          check++
        }
        if (ofs) {
          itemsData['_ite' + check] = 'MANODOPERA OFFICINA STRAORDINARIA'
          itemsData['_qty' + check] = ofs
          itemsData['_llp' + check] = this.actualFees.ofs?parseFloat(this.actualFees.ofs):''
          check++
        }
        /*for (let cr = check; cr <= check; cr++) {
          itemsData['_ite' + cr] = 'DRIVER'
          itemsData['_qty' + cr] = 3,
            itemsData['_llp' + cr] = 121.34
          itemsData['_pn' + cr] = "3115158200"
        }*/
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
                a120docBPCS: rawData.docbpcs,
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
                this.notif.newNotification(users,'New Balance', `New Balance for ${rawData.prodotto1} - ${rawData.matricola} (${rawData.cliente11})`,'','_newbalance','balance,{}')
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
