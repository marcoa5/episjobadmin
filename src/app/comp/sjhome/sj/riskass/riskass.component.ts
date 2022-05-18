import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'episjob-riskass',
  templateUrl: './riskass.component.html',
  styleUrls: ['./riskass.component.scss']
})
export class RiskassComponent implements OnInit {
  riskList: any[]=[
  'Ho informazioni sufficienti sul lavoro da svolgere?',
  'Considero sicuro il metodo di lavoro concordato?',
  'Ho letto e compreso il permesso?',
  'Sono stati rispettati tutti i termini e le condizioni dell\'autorizzazione?',
  'Sono presenti ed in buone condizioni le attrezzature necessarie?',
  'Sono presenti tutti i DPI necessari?',
  'Luogo di lavoro idoneo allo svolgimento delle operazioni richieste?',
  ]

  riskList2: any[]=[
    'Pericolo di caduta o di inciampo?',
    'Rischio di lesioni da impatto?',
    'Pericolo di essere colpiti da parti in movimento o trasporto interno?',
    'Pericolo di intrappolamento?',
    'Pericolo di caduta di oggetti?',
    'Illuminazione sufficiente?',
    'Esposizione a temperature troppo alte o basse?',
    'Contatto con corrente elettrica?',
    'Contatto con prodotti pericolosi?',
    'Formazione di polvere?',
    'Rumore o vibrazioni?',
    'Pericolo di incendio o esplosione?',
    'Ci sono altre persone che lavorano nelle vicinanze del cantiere?',
    'Esiste il rischio di inquinamento ambientale? I rifiuti vengono rimossi?',
    'Sono conosciute le procedure in caso di incidente, incendio o evacuazione ed i numeri di emergenza?',
  ]
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RiskassComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.risk1 = fb.group({
      a1:'ok',
      a2:'ok',
      a3:'ok',
      a4:'ok',
      a5:'ok',
      a6:'ok',
      a7:'ok',
      b1:'ok',
      b2:'ok',
      b3:'ok',
      b4:'ok',
      b5:'ok',
      b6:'ok',
      b7:'ok',
      b8:'ok',
      b9:'ok',
      b10:'ok',
      b11:'ok',
      b12:'ok',
      b13:'ok',
      b14:'ok',
      b15:'ok',
    })
  }
  risk1!:FormGroup
  


  ngOnInit(): void {
    Object.keys(this.data).forEach(i=>{
      this.risk1.controls[i].setValue(this.data[i])
    })
  }

  onNoClick(){
    this.dialogRef.close()
  }

  chW(){
    if(window.innerWidth<550) return true
    return false
  }

}
