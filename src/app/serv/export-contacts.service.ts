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
              let customer:any={
                Id:c.val().contId,
                Name: c.val().name,
                Surname: c.val().surname,
                Position: c.val().pos,
                Phone: c.val().phone,
                Mail: c.val().mail,
                CustomerId:c.val().custId,
                CustomerName:custList[custList.map(cu=>{return cu.id}).indexOf(c.val().custId)].c1
              }
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
