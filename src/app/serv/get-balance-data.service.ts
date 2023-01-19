import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GetBalanceDataService {
  actualFees: any = {}
  constructor() { }

  getFees(rawData: any) {
    return new Promise((res, rej) => {
      firebase.database().ref('Contracts').child('active').child(rawData.matricola).once('value', a => {
        a.forEach(b => {
          b.forEach(c => {
            if (c.val().fees != null) {
              this.actualFees = c.val().fees
              res(c.val().fees)
            } else {
              res('')
            }
          })
        })
      })
    })
  }

  async generateBalance(rawData: any) {
    await this.getFees(rawData)

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
        let items: any = {}
        for (let i = 1; i <= 7; i++) {
          if (rawData['dat' + i + '1'] != '' && rawData['dat' + i + '2'] != '' && rawData['dat' + i + '3'] != '') {
            if (rawData['spov' + i + '1'] != '') {
              mspeov += parseFloat(rawData['spov' + i + '1'])
              //if(mspeov>0) items['mspeov']=mspeov
            }
            if (rawData['spol' + i + '1'] != '') {
              mspeol += parseFloat(rawData['spol' + i + '1'])
              //if(mspeol>0) items['mspeol']=mspeol
            }
            if (rawData['spsv' + i + '1'] != '') {
              mspesv += parseFloat(rawData['spsv' + i + '1'])
              //if(mspesv>0) items['mspesv']=mspesv
            }
            if (rawData['spll' + i + '1'] != '') {
              mspesl += parseFloat(rawData['spll' + i + '1'])
              //if(mspesl>0) items['mspesl']=mspesl
            }
            if (rawData['stdv' + i + '1'] != '') {
              mstdov += parseFloat(rawData['stdv' + i + '1'])
              //if(mstdov>0) items['mstdov']=mstdov
            }
            if (rawData['stdl' + i + '1'] != '') {
              mstdol += parseFloat(rawData['stdl' + i + '1'])
              //if(mstdol>0) items['mstdol']=mstdol
            }
            if (rawData['strv' + i + '1'] != '') {
              mstdsv += parseFloat(rawData['strv' + i + '1'])
              //if(mstdsv>0) items['mstdsv']=mstdsv
            }
            if (rawData['strl' + i + '1'] != '') {
              mstdsl += parseFloat(rawData['strl' + i + '1'])
              //if(mstdsl>0) items['mstdsl']=mstdsl
            }
            if (rawData['mntv' + i + '1'] != '') {
              mnotv += parseFloat(rawData['mntv' + i + '1'])
              //if(mnotv>0) items['mnotv']=mnotv
            }
            if (rawData['mntl' + i + '1'] != '') {
              mnotl += parseFloat(rawData['mntl' + i + '1'])
              //if(mnotl>0) items['mnotl']=mnotl
            }
            if (rawData['mfv' + i + '1'] != '' && rawData['mfv' + i + '1'] != undefined) {
              mfv += parseFloat(rawData['mfv' + i + '1'])
              //if(mfv>0) items['mfv']=mfv
            }
            if (rawData['mfl' + i + '1'] != '') {
              mfl += parseFloat(rawData['mfl' + i + '1'])
              //if(mfl>0) items['mfl']=mfl
            }
            if (rawData['mnfv' + i + '1'] != '') {
              mfnotv += parseFloat(rawData['mnfv' + i + '1'])
              //if(mfnotv>0) items['mfnotv']=mfnotv
            }
            if (rawData['mnfl' + i + '1'] != '') {
              mfnotl += parseFloat(rawData['mnfl' + i + '1'])
              //if(mfnotl>0) items['mfnotl']=mfnotl
            }
            if (rawData['km' + i + '1'] != '') {
              km += parseFloat(rawData['km' + i + '1'])
              //if(km>0) items['km']=km
            }
            if (rawData['spv' + i + '1'] != '') {
              spv += parseFloat(rawData['spv' + i + '1'])
              //if(spv>0) items['spv']=spv
            }
            if (rawData['off' + i + '1'] != '') {
              off += parseFloat(rawData['off' + i + '1'])
              //if(off>0) items['off']=off
            }
            if (rawData['ofs' + i + '1'] != '') {
              ofs += parseFloat(rawData['ofs' + i + '1'])
              //if(ofs>0) items['ofs']=ofs
            }
          }
        }
        let check: number = 1
        if (mstdov) {
          items['_it' + check] = 'MANODOPERA STANDARD ORDINARIA VIAGGIO'
          items['_qty' + check] = mstdov
          items['_llp' + check] = this.actualFees.std?parseFloat(this.actualFees.std):''
          check++
        }
        if (mstdsv) {
          items['_it' + check] = 'MANODOPERA STANDARD STRAORDINARIA VIAGGIO'
          items['_qty' + check] = mstdsv
          items['_llp' + check] = this.actualFees.str?parseFloat(this.actualFees.str):''
          check++
        }
        if (mstdol) {
          items['_it' + check] = 'MANODOPERA STANDARD ORDINARIA LAVORO'
          items['_qty' + check] = mstdol
          items['_llp' + check] = this.actualFees.std?parseFloat(this.actualFees.std):''
          check++
        }
        if (mstdsl) {
          items['_it' + check] = 'MANODOPERA STANDARD STRAORDINARIA LAVORO'
          items['_qty' + check] = mstdsl
          items['_llp' + check] = this.actualFees.str?parseFloat(this.actualFees.str):''
          check++
        }
        if (mspeov) {
          items['_it' + check] = 'MANODOPERA SPECIALISTICA ORDINARIA VIAGGIO'
          items['_qty' + check] = mspeov
          items['_llp' + check] = this.actualFees.spo?parseFloat(this.actualFees.spo):''
          check++
        }
        if (mspesv) {
          items['_it' + check] = 'MANODOPERA SPECIALISTICA STRAORDINARIA VIAGGIO'
          items['_qty' + check] = mspesv
          items['_llp' + check] = this.actualFees.sps?parseFloat(this.actualFees.sps):''
          check++
        }
        if (mspeol) {
          items['_it' + check] = 'MANODOPERA SPECIALISTICA ORDINARIA LAVORO'
          items['_qty' + check] = mspeol
          items['_llp' + check] = this.actualFees.spo?parseFloat(this.actualFees.spo):''
          check++
        }
        if (mspesl) {
          items['_it' + check] = 'MANODOPERA SPECIALISTICA STRAORDINARIA LAVORO'
          items['_qty' + check] = mspesl
          items['_llp' + check] = this.actualFees.sps?parseFloat(this.actualFees.sps):''
          check++
        }
        if (mnotv) {
          items['_it' + check] = 'MANODOPERA NOTTURNA VIAGGIO'
          items['_qty' + check] = mnotv
          check++
        }
        if (mnotl) {
          items['_it' + check] = 'MANODOPERA NOTTURNA LAVORO'
          items['_qty' + check] = mnotl
          items['_llp' + check] = this.actualFees.mnt?parseFloat(this.actualFees.mnt):''
          check++
        }
        if (mfv) {
          items['_it' + check] = 'MANODOPERA FESTIVA VIAGGIO'
          items['_qty' + check] = mfv
          items['_llp' + check] = this.actualFees.mf?parseFloat(this.actualFees.mf):''
          check++
        }
        if (mfl) {
          items['_it' + check] = 'MANODOPERA FESTIVA LAVORO'
          items['_qty' + check] = mfl
          items['_llp' + check] = this.actualFees.mf?parseFloat(this.actualFees.mf):''

          check++
        }
        if (mfnotv) {
          items['_it' + check] = 'MANODOPERA FESTIVA NOTTURNA VIAGGIO'
          items['_qty' + check] = mfnotv
          items['_llp' + check] = this.actualFees.mnf?parseFloat(this.actualFees.mnf):''
          check++
        }
        if (mfnotl) {
          items['_it' + check] = 'MANODOPERA FESTIVA NOTTURNA LAVORO'
          items['_qty' + check] = mfnotl
          items['_llp' + check] = this.actualFees.mnf?parseFloat(this.actualFees.mnf):''

          check++
        }
        if (spv) {
          items['_it' + check] = 'SPESE VIAGGIO'
          items['_qty' + check] = 1
          items['_llp' + check] = spv
          check++
        }
        if (km) {
          items['_it' + check] = 'CHILOMETRI'
          items['_qty' + check] = km
          items['_llp' + check] = this.actualFees.km?parseFloat(this.actualFees.km):''
          check++
        }
        if (off) {
          items['_it' + check] = 'MANODOPERA OFFICINA ORDINARIA'
          items['_qty' + check] = off
          items['_llp' + check] = this.actualFees.off?parseFloat(this.actualFees.off):''
          check++
        }
        if (ofs) {
          items['_it' + check] = 'MANODOPERA OFFICINA STRAORDINARIA'
          items['_qty' + check] = ofs
          items['_llp' + check] = this.actualFees.ofs?parseFloat(this.actualFees.ofs):''
          check++
        }
        /*for (let cr = check; cr <= check; cr++) {
          items['_it' + cr] = 'DRIVER'
          items['_qty' + cr] = 3,
            items['_llp' + cr] = 121.34
          items['_pn' + cr] = "3115158200"
        }*/
        sub.next(items)
      })

      custC.subscribe((r: any) => {
        shipto.subscribe((s: any) => {
          if (s != '') s = s.split(' - ')
          items.subscribe((i: any) => {
            macItNr.subscribe((m: any) => {
              console.log(this.actualFees)
              let info: any = {
                custCode: r,
                data: rawData.data11,
                docBPCS: rawData.docbpcs,
                shipTo1: rawData.cliente11,
                shipTo2: s[0] ? s[0] : '',
                shipTo3: s[1] ? s[1] : '',
                shipTo4: s[2] ? s[2] : '',
                customer1: rawData.cliente11,
                customer2: rawData.cliente12,
                customer3: rawData.cliente13,
                yourRef: rawData.vsordine ? rawData.vsordine : '',
                ourRef: '',
                terms: '',
                rig: rawData.prodotto1 + ' s.n. ' + rawData.matricola + (m != '' ? ' (' + m.toString().substring(0, 4) + '.' + m.toString().substring(4, 8) + '.' + m.toString().substring(8, 10) + ')' : ''),
              }
              Object.keys(i).forEach(it => {
                info[it] = i[it]
              })
              res(info)
            })
          })
        })
      })
    })
  }

}
