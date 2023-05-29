import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';

@Injectable({
  providedIn: 'root'
})
export class ExportContactsService {

  constructor(private dialog: MatDialog) { }


  

  export(custList:any[]){
    let lis:any[]=[]
    return new Promise(res=>{
      firebase.database().ref('CustContacts').once('value',a=>{
        if(a.val()!=null) {
          a.forEach(b=>{
            b.forEach(c=>{
              let customer:any={}
              customer=c.val()
              let ind:number=custList.map(cu=>{return cu.id}).indexOf(customer.custId)
              customer.custName= custList[ind].c1
              lis.push(customer)
            })
          })
        } else {
          res('')
        }
      }).then(()=>{
        res(lis)
      })
    })
  }
}
