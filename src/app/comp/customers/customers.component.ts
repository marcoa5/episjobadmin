import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { BackService }  from '../../serv/back.service'
import firebase from 'firebase'
import 'firebase/database'

@Component({
  selector: 'episjob-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  filtro:any=''
  customers:any[]=[];
  pos:string='';
  ind:number=0
  custSales:string[]=[]
  rigSn:string[]=[]
  constructor(public router: Router, public bak:BackService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        this.pos=b.val().Pos
        this.ind=b.val().Area?.toString()
      })
      .then(()=>{
        if(this.pos!='sales'){
          firebase.database().ref('Customers').on('value', g=>{
            this.customers = Object.values(g.val())
            
          })
        } /*else {
          firebase.database().ref('Customers/').once('value',kj=>{
            this.custSales = kj.val()
            //console.log(this.custSales)
          })
          .then(()=>{
            firebase.database().ref('RigAuth').orderByChild('a' + this.ind).equalTo('1').once('value',u=>{
              u.forEach(g=>{
                firebase.database().ref('MOL/' + g.key).child('customer').once('value',hg=>{
                  let fre = hg.val().replace('/00','')
                  firebase.database().ref('Customers/').child(fre.replace(/\./g,'')).once('value',tr=>{
                    let f:any = (Object.values(tr.val())[0])
                    let s = f.toString()
                    console.log(s)
                    if(tr.val()!=null && !JSON.stringify(this.customers).includes(s)) {
                      this.customers.push(tr.val())
                    }
                  })
                  .catch(()=>{})
                })
              })
            })
          })
        }*/
      })
    })
  }

  open(a: String, b:string, c:string){
    this.router.navigate(['cliente',{cust1:a, cust2:b, cust3:c}])
  }

  
  back(){
    this.bak.backP()
  }

  filter(a:any){
    this.filtro=a
  }  
}
