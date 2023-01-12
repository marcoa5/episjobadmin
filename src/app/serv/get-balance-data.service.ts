import {Observable} from 'rxjs'
import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';
@Injectable({
  providedIn: 'root'
})
export class GetBalanceDataService {
  
  constructor() { }

  generateBalance(rawData:any){
    console.log(rawData)
    return new Promise((res,rej)=>{
      let custC = new Observable(sub=>{
        firebase.database().ref('MOL').child(rawData.matricola).once('value').then(a=>{
          if(a.val()){
            firebase.database().ref('CustomerC').child(a.val().custid).once('value',b=>{
              if(b.val().code!=null) {
                sub.next(b.val().code)
              } else {
                sub.next('')
              }
            })
          }
        })
      })
      let shipto=new Observable(sub2=>{
        firebase.database().ref('shipTo').child(rawData.matricola).once('value',l=>{
          if(l.val()!=null) {
            sub2.next(l.val().address)
          } else {
            sub2.next('')
          }
        })
      })
      let macItNr=new Observable(sub=>{
        firebase.database().ref('MOL').child(rawData.matricola).child('in').once('value',t=>{
          if(t.val()!=null) {
            sub.next(t.val())
          } else {
            sub.next('')
          }
        })
      })
      let items=new Observable(sub=>{
        let mstdov:number=0
        let mstdsv:number=0
        let mstdol:number=0
        let mstdsl:number=0
        let mspeov:number=0
        let mspesv:number=0
        let mspeol:number=0
        let mspesl:number=0
        let mnotv:number=0
        let mnotl:number=0
        let mfv:number=0
        let mfl:number=0
        let mfnotv:number=0
        let mfnotl:number=0
        let km:number=0
        let spv:number=0
        let off:number=0
        let ofs:number=0
        let items:any={}
        for(let i=1;i<=7;i++){
          if(rawData['dat' + i + '1']!='' && rawData['dat' + i + '2']!='' &&rawData['dat' + i + '3']!='') {
            if(rawData['spov' + i + '1']!='') {
              mspeov+=parseFloat(rawData['spov' + i + '1'])
              //if(mspeov>0) items['mspeov']=mspeov
            }
            if(rawData['spol' + i + '1']!='') {
              mspeol+=parseFloat(rawData['spol' + i + '1'])
              //if(mspeol>0) items['mspeol']=mspeol
            }
            if(rawData['spsv' + i + '1']!='') {
              mspesv+=parseFloat(rawData['spsv' + i + '1'])
              //if(mspesv>0) items['mspesv']=mspesv
            }
            if(rawData['spll' + i + '1']!='') {
              mspesl+=parseFloat(rawData['spll' + i + '1'])
              //if(mspesl>0) items['mspesl']=mspesl
            }
            if(rawData['stdv' + i + '1']!='') {
              mstdov+=parseFloat(rawData['stdv' + i + '1'])
              //if(mstdov>0) items['mstdov']=mstdov
            }
            if(rawData['stdl' + i + '1']!='') {
              mstdol+=parseFloat(rawData['stdl' + i + '1'])
              //if(mstdol>0) items['mstdol']=mstdol
            }
            if(rawData['strv' + i + '1']!='') {
              mstdsv+=parseFloat(rawData['strv' + i + '1'])
              //if(mstdsv>0) items['mstdsv']=mstdsv
            }
            if(rawData['strl' + i + '1']!='') {
              mstdsl+=parseFloat(rawData['strl' + i + '1'])
              //if(mstdsl>0) items['mstdsl']=mstdsl
            }
            if(rawData['mntv' + i + '1']!='') {
              mnotv+=parseFloat(rawData['mntv' + i + '1'])
              //if(mnotv>0) items['mnotv']=mnotv
            }
            if(rawData['mntl' + i + '1']!='') {
              mnotl+=parseFloat(rawData['mntl' + i + '1'])
              //if(mnotl>0) items['mnotl']=mnotl
            }
            if(rawData['mfv' + i + '1']!='' && rawData['mfv' + i + '1']!=undefined) {
              mfv+=parseFloat(rawData['mfv' + i + '1'])
              //if(mfv>0) items['mfv']=mfv
            }
            if(rawData['mfl' + i + '1']!='') {
              mfl+=parseFloat(rawData['mfl' + i + '1'])
              //if(mfl>0) items['mfl']=mfl
            }
            if(rawData['mnfv' + i + '1']!='') {
              mfnotv+=parseFloat(rawData['mnfv' + i + '1'])
              //if(mfnotv>0) items['mfnotv']=mfnotv
            }
            if(rawData['mnfl' + i + '1']!='') {
              mfnotl+=parseFloat(rawData['mnfl' + i + '1'])
              //if(mfnotl>0) items['mfnotl']=mfnotl
            }
            if(rawData['km' + i + '1']!='') {
              km+=parseFloat(rawData['km' + i + '1'])
              //if(km>0) items['km']=km
            }
            if(rawData['spv' + i + '1']!='') {
              spv+=parseFloat(rawData['spv' + i + '1'])
              //if(spv>0) items['spv']=spv
            }
            if(rawData['off' + i + '1']!='') {
              off+=parseFloat(rawData['off' + i + '1'])
              //if(off>0) items['off']=off
            }
            if(rawData['ofs' + i + '1']!='') {
              ofs+=parseFloat(rawData['ofs' + i + '1'])
              //if(ofs>0) items['ofs']=ofs
            }
          }
        }
        let check:number=1
        if(mstdov){
          items[check]={item: 'MANODOPERA STANDARD ORDINARIA VIAGGIO',qty:mstdov}
          check++
        }
        if(mstdsv){
          items[check]={item: 'MANODOPERA STANDARD STRAORDINARIA VIAGGIO',qty:mstdsv}
          check++
        }
        if(mstdol){
          items[check]={item: 'MANODOPERA STANDARD ORDINARIA LAVORO',qty:mstdol}
          check++
        }
        if(mstdsl){
          items[check]={item: 'MANODOPERA STANDARD STRAORDINARIA LAVORO',qty:mstdsl}
          check++
        }
        if(mspeov){
          items[check]={item: 'MANODOPERA SPECIALISTICA ORDINARIA VIAGGIO',qty:mspeov}
          check++
        }
        if(mspesv){
          items[check]={item: 'MANODOPERA SPECIALISTICA STRAORDINARIA VIAGGIO',qty:mspesv}
          check++
        }
        if(mspeol){
          items[check]={item: 'MANODOPERA SPECIALISTICA ORDINARIA LAVORO',qty:mspeol}
          check++
        }
        if(mspesl){
          items[check]={item: 'MANODOPERA SPECIALISTICA STRAORDINARIA LAVORO',qty:mspesl}
          check++
        }
        if(mnotv){
          items[check]={item: 'MANODOPERA NOTTURNA VIAGGIO',qty:mnotv}
          check++
        }
        if(mnotl){
          items[check]={item: 'MANODOPERA NOTTURNA LAVORO',qty:mnotl}
          check++
        }
        if(mfv){
          items[check]={item: 'MANODOPERA FESTIVA VIAGGIO',qty:mfv}
          check++
        }
        if(mfl){
          items[check]={item: 'MANODOPERA FESTIVA LAVORO',qty:mfl}
          check++
        }
        if(mfnotv){
          items[check]={item: 'MANODOPERA FESTIVA NOTTURNA VIAGGIO',qty:mfnotv}
          check++
        }
        if(mfnotl){
          items[check]={item: 'MANODOPERA FESTIVA NOTTURNA LAVORO',qty:mfnotl}
          check++
        }
        if(spv){
          items[check]={item: 'SPESE VIAGGIO',amt:spv,qty:1}
          check++
        }
        if(km){
          items[check]={item: 'CHILOMETRI',qty:km}
          check++
        }
        if(off){
          items[check]={item: 'MANODOPERA OFFICINA ORDINARIA',qty:off}
          check++
        }
        if(ofs){
          items[check]={item: 'MANODOPERA OFFICINA STRAORDINARIA',qty:ofs}
          check++
        }
        for(let cr=check;cr<=check;cr++) {
          items[cr]={item: 'DRIVER',qty:3,amt:121.34,pn:"3115158200"}
        }
        sub.next(items)
      })

      custC.subscribe((r:any)=>{
        shipto.subscribe((s:any)=>{
          if(s!='') s = s.split(' - ')
          items.subscribe(i=>{
            macItNr.subscribe((m:any)=>{
              let info:any={
                custCode:r,
                data:rawData.data11,
                docBPCS:rawData.docbpcs,
                shipTo1: rawData.cliente11,
                shipTo2: s[0]?s[0]:'',
                shipTo3: s[1]?s[1]:'',
                shipTo4: s[2]?s[2]:'',
                customer1:rawData.cliente11,
                customer2:rawData.cliente12,
                customer3:rawData.cliente13,
                yourRef:rawData.vsordine,
                ourRef:'',
                terms:'',
                rig:rawData.prodotto1 + ' s.n. ' + rawData.matricola + (m!=''?' (' + m.toString().substring(0,4)+'.'+m.toString().substring(4,8)+'.'+m.toString().substring(8,10)+')':''),
                items:i
              }
              res(info)
            })
          })
        })
      })  
    })
  }

}
