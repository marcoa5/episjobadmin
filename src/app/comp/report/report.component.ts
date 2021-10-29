import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import * as moment from 'moment'
import * as XLSX from 'xlsx'
import { HttpClient, HttpParams } from '@angular/common/http'
import {Clipboard} from '@angular/cdk/clipboard';
import {Sort} from '@angular/material/sort';


@Component({
  selector: 'episjob-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('contT')
  certiqN:any
  filt:boolean=true
  contT:ElementRef|undefined
  rigs:any[]=[]
  mac: any
  length:number=0
  ch:number=0
  isThinking: boolean=false
  _machineData:any=[]
  machineData:any=[]
  isMobile:boolean=true
  isAsc:boolean=true
  info: any=[
    {
        "machineItemNumber": "8992009970",
        "machineCompany": "Manfredi Technique srl (Cave Gioia)",
        "machineSite": "Carrara",
        "machineModel": "FlexiROC D50 -10SF",
        "machineSerialNr": "TMG16SED0091",
        "LastDayEngineHours": 0,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 250,
        "servicePredictedDate": "2018-12-03T23:56:06Z",
        "machineHrs": 0
    },
    {
        "machineItemNumber": "8992009965",
        "machineCompany": "F.E.A. sas",
        "machineSite": "Bari",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG16SED0135",
        "LastDayEngineHours": 0,
        "serviceStep": "3500 (B-500)",
        "hoursLeftToService": 140,
        "servicePredictedDate": "2022-03-16T23:52:04Z",
        "machineHrs": 3360
    },
    {
        "machineItemNumber": "8992010036",
        "machineCompany": "Sibelco Italia spa",
        "machineSite": "Robilante",
        "machineModel": "SmartROC T45",
        "machineSerialNr": "TMG16SED0232",
        "LastDayEngineHours": 5,
        "serviceStep": "4500 (C-1500)",
        "hoursLeftToService": 111,
        "servicePredictedDate": "2021-12-15T15:40:17.504Z",
        "machineHrs": 4389
    },
    {
        "machineItemNumber": "8992009994",
        "machineCompany": "Cava Giardinello srl",
        "machineSite": "Termini Imerese",
        "machineModel": "FlexiROC T40",
        "machineSerialNr": "TMG16SED0279",
        "LastDayEngineHours": 7,
        "serviceStep": "7000 (B-500)",
        "hoursLeftToService": 237,
        "servicePredictedDate": "2022-01-03T06:07:49.819Z",
        "machineHrs": 6763
    },
    {
        "machineItemNumber": "8992010129",
        "machineCompany": "Minerali Industriali srl",
        "machineSite": "Sondalo",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG16SED0386",
        "LastDayEngineHours": 0,
        "serviceStep": "1250 (A-250)",
        "hoursLeftToService": 173,
        "servicePredictedDate": "2021-05-18T11:19:53Z",
        "machineHrs": 1077
    },
    {
        "machineItemNumber": "8992010226",
        "machineCompany": "TeamNetwork srl",
        "machineSite": "Augusta",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG16SED0399",
        "LastDayEngineHours": 0,
        "serviceStep": "5000 (B-500)",
        "hoursLeftToService": 113,
        "servicePredictedDate": "2021-12-05T14:39:57.319Z",
        "machineHrs": 4887
    },
    {
        "machineItemNumber": "8992010198",
        "machineCompany": "Sei Epc Italia spa",
        "machineSite": "Sardegna",
        "machineModel": "FlexiROC T40",
        "machineSerialNr": "TMG16SED0414",
        "LastDayEngineHours": 0,
        "serviceStep": "5250 (A-250)",
        "hoursLeftToService": 212,
        "servicePredictedDate": "2022-05-25T07:21:58Z",
        "machineHrs": 5038
    },
    {
        "machineItemNumber": "8992010335",
        "machineCompany": "Rocca Mar srl",
        "machineSite": "Millesimo",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG16SED0514",
        "LastDayEngineHours": 0,
        "serviceStepABC": ""
    },
    {
        "machineItemNumber": "8992010516",
        "machineCompany": "Italcave spa",
        "machineSite": "Taranto",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG17SED0198",
        "LastDayEngineHours": 7,
        "serviceStep": "2500 (B-500)",
        "hoursLeftToService": 32,
        "servicePredictedDate": "2021-11-19T10:14:22.738Z",
        "machineHrs": 2468
    },
    {
        "machineItemNumber": "8992010517",
        "machineCompany": "Italcave spa",
        "machineSite": "Taranto",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG17SED0204",
        "LastDayEngineHours": 0,
        "serviceStep": "2500 (B-500)",
        "hoursLeftToService": 71,
        "servicePredictedDate": "2021-12-06T19:34:15.784Z",
        "machineHrs": 2429
    },
    {
        "machineItemNumber": "8992010747",
        "machineCompany": "Sacef 73 srl",
        "machineSite": "Rezzato",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG17SED0383",
        "LastDayEngineHours": 0,
        "serviceStep": "2750 (A-250)",
        "hoursLeftToService": 119,
        "servicePredictedDate": "2022-02-24T02:03:00Z",
        "machineHrs": 2631
    },
    {
        "machineItemNumber": "8992010810",
        "machineCompany": "F.E.A. sas",
        "machineSite": "Bari",
        "machineModel": "FlexiROC T40",
        "machineSerialNr": "TMG17SED0443",
        "LastDayEngineHours": 0,
        "serviceStep": "3500 (B-500)",
        "hoursLeftToService": 47,
        "servicePredictedDate": "2021-11-19T07:02:50.269Z",
        "machineHrs": 3453
    },
    {
        "machineItemNumber": "8992010749",
        "machineCompany": "Unicalce spa",
        "machineSite": "Genova",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG17SED0475",
        "LastDayEngineHours": 1,
        "serviceStep": "4250 (A-250)",
        "hoursLeftToService": 17,
        "servicePredictedDate": "2021-11-04T14:14:34.584Z",
        "machineHrs": 4233
    },
    {
        "machineItemNumber": "8992010946",
        "machineCompany": "Ston srl",
        "machineSite": "Roccarainola",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG17SED0619",
        "LastDayEngineHours": 0,
        "serviceStep": "750 (A-250)",
        "hoursLeftToService": 125,
        "servicePredictedDate": "2021-11-03T02:17:18.081Z",
        "machineHrs": 625
    },
    {
        "machineItemNumber": "8992011020",
        "machineCompany": "F.E.A. sas",
        "machineSite": "Bari",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG17SED0681",
        "LastDayEngineHours": 0,
        "serviceStep": "2250 (A-250)",
        "hoursLeftToService": 86,
        "servicePredictedDate": "2021-09-18T05:56:20Z",
        "machineHrs": 2164
    },
    {
        "machineItemNumber": "8992011041",
        "machineCompany": "S.e.ma.c. srl ",
        "machineSite": "Roccarainola",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG17SED0685",
        "LastDayEngineHours": 0,
        "serviceStep": "4250 (A-250)",
        "hoursLeftToService": 81,
        "servicePredictedDate": "2021-09-25T21:18:16.251Z",
        "machineHrs": 4169
    },
    {
        "machineItemNumber": "8992011261",
        "machineCompany": "Fassa srl",
        "machineSite": "Dolcè",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG18SED0269",
        "LastDayEngineHours": 5,
        "serviceStep": "4000 (B-500)",
        "hoursLeftToService": 266,
        "servicePredictedDate": "2022-01-05T08:04:48.982Z",
        "machineHrs": 3734
    },
    {
        "machineItemNumber": "8992011401",
        "machineCompany": "Sei Epc Italia spa",
        "machineSite": "Orvieto",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG18SED0361",
        "LastDayEngineHours": 9,
        "serviceStep": "4250 (A-250)",
        "hoursLeftToService": 65,
        "servicePredictedDate": "2021-11-23T00:42:30.021Z",
        "machineHrs": 4185
    },
    {
        "machineItemNumber": "8992011503",
        "machineCompany": "F.E.A. sas",
        "machineSite": "Bari",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG18SED0573",
        "LastDayEngineHours": 0,
        "serviceStep": "2250 (A-250)",
        "hoursLeftToService": 20,
        "servicePredictedDate": "2021-07-13T21:32:13Z",
        "machineHrs": 2230
    },
    {
        "machineItemNumber": "8992011579",
        "machineCompany": "Granulati Calcarei Redipuglia",
        "machineSite": "Ronchi dei Legionari",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG18SED0624",
        "LastDayEngineHours": 1,
        "serviceStep": "3000 (C-1500)",
        "hoursLeftToService": 192,
        "servicePredictedDate": "2022-02-03T17:27:04.965Z",
        "machineHrs": 2808
    },
    {
        "machineItemNumber": "8992011790",
        "machineCompany": "Sei Epc Italia spa",
        "machineSite": "Sardegna",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG19SED0109",
        "LastDayEngineHours": 7,
        "serviceStep": "2000 (B-500)",
        "hoursLeftToService": 91,
        "servicePredictedDate": "2021-12-02T13:20:52.886Z",
        "machineHrs": 1909
    },
    {
        "machineItemNumber": "8992011902",
        "machineCompany": "Unicalce spa",
        "machineSite": "San Pellegrino",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG19SED0159",
        "LastDayEngineHours": 6,
        "serviceStep": "3250 (A-250)",
        "hoursLeftToService": 170,
        "servicePredictedDate": "2021-12-23T19:08:52.18Z",
        "machineHrs": 3080
    },
    {
        "machineItemNumber": "8992011924",
        "machineCompany": "Tecnocom Rent srl",
        "machineSite": "Lavis",
        "machineModel": "FlexiROC T15 R",
        "machineSerialNr": "TMG19SED0126",
        "LastDayEngineHours": 7,
        "serviceStep": "1250 (A-250)",
        "hoursLeftToService": 169,
        "servicePredictedDate": "2022-04-15T07:08:36Z",
        "machineHrs": 1081
    },
    {
        "machineItemNumber": "8992011925",
        "machineCompany": "Pellegrini Consolidamenti srl",
        "machineSite": "Narni",
        "machineModel": "FlexiROC T15 R",
        "machineSerialNr": "TMG19SED0127",
        "LastDayEngineHours": 0,
        "serviceStep": "500 (B-500)",
        "hoursLeftToService": 181,
        "servicePredictedDate": "2022-04-27T01:23:34Z",
        "machineHrs": 319
    },
    {
        "machineItemNumber": "8992012032",
        "machineCompany": "Transbagger Gmbh",
        "machineSite": "Campo Tures",
        "machineModel": "FlexiROC T30",
        "machineSerialNr": "TMG19SED0285",
        "LastDayEngineHours": 0,
        "serviceStep": "1250 (A-250)",
        "hoursLeftToService": 38,
        "servicePredictedDate": "2021-07-31T23:56:40Z",
        "machineHrs": 1212
    },
    {
        "machineItemNumber": "8992012156",
        "machineCompany": "Cava Nuova Bartolina srl",
        "machineSite": "Gavorrano",
        "machineModel": "FlexiROC T35",
        "machineSerialNr": "TMG19SED0439",
        "LastDayEngineHours": 6,
        "serviceStep": "1500 (C-1500)",
        "hoursLeftToService": 165,
        "servicePredictedDate": "2022-01-19T01:38:38.995Z",
        "machineHrs": 1335
    },
    {
        "machineItemNumber": "8992012078",
        "machineCompany": "Sales spa",
        "machineSite": "Venturina",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG19SED0468",
        "LastDayEngineHours": 8,
        "serviceStep": "2250 (A-250)",
        "hoursLeftToService": 162,
        "servicePredictedDate": "2022-01-08T07:20:14.182Z",
        "machineHrs": 2088
    },
    {
        "machineItemNumber": "8992012211",
        "machineCompany": "IMI srl",
        "machineSite": "Roccarainola",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG19SED0486",
        "LastDayEngineHours": 0,
        "serviceStep": "1000 (B-500)",
        "hoursLeftToService": 280,
        "servicePredictedDate": "2022-08-04T15:59:00Z",
        "machineHrs": 720
    },
    {
        "machineItemNumber": "8992012229",
        "machineCompany": "Cave di Campiglia spa",
        "machineSite": "Campiglia Marittima",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG19SED0497",
        "LastDayEngineHours": 7,
        "serviceStep": "1750 (A-250)",
        "hoursLeftToService": 60,
        "servicePredictedDate": "2021-12-27T15:28:58Z",
        "machineHrs": 1690
    },
    {
        "machineItemNumber": "8992012368",
        "machineCompany": "Vernia srl",
        "machineSite": "San Giuliano M.se",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG19SED0565",
        "LastDayEngineHours": 0,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 240,
        "servicePredictedDate": "2022-06-25T08:21:16Z",
        "machineHrs": 10
    },
    {
        "machineItemNumber": "8992012335",
        "machineCompany": "Cava di Sarone srl",
        "machineSite": "Sarone di Caneva",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG19SED0567",
        "LastDayEngineHours": 3,
        "serviceStep": "1250 (A-250)",
        "hoursLeftToService": 176,
        "servicePredictedDate": "2022-01-25T23:33:36.239Z",
        "machineHrs": 1074
    },
    {
        "machineItemNumber": "8992012482",
        "machineCompany": "Fassa srl",
        "machineSite": "Gavardo",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG20SED0068",
        "LastDayEngineHours": 9,
        "serviceStep": "2500 (B-500)",
        "hoursLeftToService": 231,
        "servicePredictedDate": "2021-12-28T19:58:50.786Z",
        "machineHrs": 2269
    },
    {
        "machineItemNumber": "8992012483",
        "machineCompany": "Fassa srl",
        "machineSite": "Sabbio Chiese",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG20SED0085",
        "LastDayEngineHours": 0,
        "serviceStep": "1250 (A-250)",
        "hoursLeftToService": 119,
        "servicePredictedDate": "2022-01-04T14:19:32.123Z",
        "machineHrs": 1131
    },
    {
        "machineItemNumber": "8992012486",
        "machineCompany": "Nuova Ima srl",
        "machineSite": "Pieve d'Alpago",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG20SED0092",
        "LastDayEngineHours": 1,
        "serviceStep": "500 (B-500)",
        "hoursLeftToService": 245,
        "servicePredictedDate": "2022-06-29T17:57:11Z",
        "machineHrs": 255
    },
    {
        "machineItemNumber": "8992012681",
        "machineCompany": "Carminati Flli Spa",
        "machineSite": "Bevera di Ventimiglia",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG20SED0267",
        "LastDayEngineHours": 7,
        "serviceStep": "1000 (B-500)",
        "hoursLeftToService": 167,
        "servicePredictedDate": "2022-04-12T14:21:14Z",
        "machineHrs": 833
    },
    {
        "machineItemNumber": "8992012784",
        "machineCompany": "Sei Epc Italia spa",
        "machineSite": "Maddaloni",
        "machineModel": "FlexiROC T40",
        "machineSerialNr": "TMG20SED0378",
        "LastDayEngineHours": 0,
        "serviceStep": "1000 (B-500)",
        "hoursLeftToService": 223,
        "servicePredictedDate": "2022-01-30T03:11:39.626Z",
        "machineHrs": 777
    },
    {
        "machineItemNumber": "8992012808",
        "machineCompany": "Scavi e Demolizioni srl",
        "machineSite": "Tanca Farrà",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG20SED0381",
        "LastDayEngineHours": 5,
        "serviceStep": "750 (A-250)",
        "hoursLeftToService": 219,
        "servicePredictedDate": "2022-02-19T20:51:18.527Z",
        "machineHrs": 531
    },
    {
        "machineItemNumber": "8992012893",
        "machineCompany": "Giuggia Costruzioni srl",
        "machineSite": "Villanova Mondovì",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG20SED0460",
        "LastDayEngineHours": 0,
        "serviceStep": "500 (B-500)",
        "hoursLeftToService": 127,
        "servicePredictedDate": "2022-01-14T22:14:41.96Z",
        "machineHrs": 373
    },
    {
        "machineItemNumber": "8992012782",
        "machineCompany": "Salcef spa",
        "machineSite": "Roma",
        "machineModel": "FlexiROC T15 R",
        "machineSerialNr": "TMG20SED0366",
        "LastDayEngineHours": 0,
        "serviceStep": "500 (B-500)",
        "hoursLeftToService": 58,
        "servicePredictedDate": "2021-12-24T21:51:52.2Z",
        "machineHrs": 442
    },
    {
        "machineItemNumber": "8992012901",
        "machineCompany": "Efi srl",
        "machineSite": "Caldarola",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG20SED0488",
        "LastDayEngineHours": 0,
        "serviceStep": "500 (B-500)",
        "hoursLeftToService": 141,
        "servicePredictedDate": "2022-03-18T02:21:13Z",
        "machineHrs": 359
    },
    {
        "machineItemNumber": "8992013017",
        "machineCompany": "Italsud Salerno srl",
        "machineSite": "Salza Irpina",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG20SED0525",
        "LastDayEngineHours": 6,
        "serviceStep": "1250 (A-250)",
        "hoursLeftToService": 104,
        "servicePredictedDate": "2021-11-29T08:01:23.826Z",
        "machineHrs": 1146
    },
    {
        "machineItemNumber": "8992013193",
        "machineCompany": "In.Pro.Mar srl",
        "machineSite": "Orosei",
        "machineModel": "FlexiROC T15 R",
        "machineSerialNr": "TMG21SED0140",
        "LastDayEngineHours": 6,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 144,
        "servicePredictedDate": "2022-03-21T20:39:17.6Z",
        "machineHrs": 106
    },
    {
        "machineItemNumber": "8992013299",
        "machineCompany": "F.E.A. sas",
        "machineSite": "Bari",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG21SED0193",
        "LastDayEngineHours": 0,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 246,
        "servicePredictedDate": "2022-05-26T10:52:59Z",
        "machineHrs": 4
    },
    {
        "machineItemNumber": "8999448100",
        "machineCompany": "Notari Spa",
        "machineSite": "Sordio",
        "machineModel": "Boomer S2",
        "machineSerialNr": "TMG20URE0127",
        "LastDayEngineHours": 0,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 155,
        "servicePredictedDate": "2021-09-23T10:59:22Z",
        "machineHrs": 95
    },
    {
        "machineItemNumber": "8992013323",
        "machineCompany": "Marmi Molvina srl",
        "machineSite": "Nuvolera",
        "machineModel": "SmartROC T35",
        "machineSerialNr": "TMG21SED0321",
        "LastDayEngineHours": 0,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 74,
        "servicePredictedDate": "2022-01-06T17:57:38.941Z",
        "machineHrs": 176
    },
    {
        "machineItemNumber": "8992013357",
        "machineCompany": "Ceca srl",
        "machineSite": "Roccarainola",
        "machineModel": "SmartROC T40",
        "machineSerialNr": "TMG21SED0356",
        "LastDayEngineHours": 0,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 244,
        "servicePredictedDate": "2022-06-28T01:57:14Z",
        "machineHrs": 6
    },
    {
        "machineItemNumber": "8992013511",
        "machineCompany": "Sibelco Italia spa",
        "machineSite": "Robilante",
        "machineModel": "SmartROC T45 - 10",
        "machineSerialNr": "TMG21SED0449",
        "LastDayEngineHours": 6,
        "serviceStep": "250 (A-250)",
        "hoursLeftToService": 76,
        "servicePredictedDate": "2021-12-09T10:40:30.171Z",
        "machineHrs": 174
    },
    {
        "machineItemNumber": "8997798800",
        "machineCompany": "Imi Fabi spa",
        "machineSite": "Lanzada",
        "machineModel": "ST14 Battery",
        "machineSerialNr": "TMG20URE0457",
        "LastDayEngineHours": 0,
        "serviceStep": 125,
        "hoursLeftToService": 17,
        "servicePredictedDate": "2021-11-13T07:29:38.88Z",
        "machineHrs": 108,
        "serviceStepABC": ""
    }
]
  pos:string=''
  sortedData:any[]=[]
  displayedColumns:any=['Serial Number', 'Model','Company','Site','Engine Hrs','Service Int','Hours to next service','.', 'Service pred date','Prev day hours' ]
  constructor(private http: HttpClient, private clip: Clipboard) {
  }

  ngOnInit(): void {
    this.onResize()
    firebase.auth().onAuthStateChanged(a=>{
      if(a){
        firebase.database().ref('Users').child(a.uid).child('Pos').once('value',b=>{
          this.pos=b.val()
        })
      }
    })
  }

  all(){
    this.export()
    .then(()=>{
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.table_to_sheet(document.getElementById('ex'))
      XLSX.utils.book_append_sheet(wb,ws)
      var cell=[]
      for(let i = 0; i<10;i++){
        cell.push({c: i, r:0, wch:20})
      }
      ws['!cols'] = cell
      let nome = moment(new Date()).format('YYYYMMDDhhmmss')
      XLSX.writeFile(wb,`Export ${nome}.xlsx`)
    })
  }

  export(){
    return new Promise((res,rej)=>{
      firebase.database().ref('MOL').once('value',async a=>{
        let r = Object.keys(a.val())
        this.length = r.length
        await Object.keys(a.val()).map(async b=>{
          await firebase.database().ref('Hours/'+b).once('value',c=>{
            let g, lastread, ore:any
            if (c.val()!=null) {
              ore = Object.values(c.val())[0]
              g = Object.keys(c.val())[0]
              let f = `${g.substring(0,4)}-${g.substring(4,6)}-${g.substring(6,8)}`
              lastread = moment(new Date(f)).format('DD/MM/YYYY')
            }
            this.rigs.push({
              sn: a.val()[b].sn,
              in: a.val()[b].in,
              site: a.val()[b].site,
              model: a.val()[b].model,
              customer: a.val()[b].customer,
              lastread: lastread?lastread:'',
              orem: lastread?(ore.orem==''||ore.orem==undefined?'0':ore.orem):'0',
              perc1: lastread?(ore.perc1==''||ore.perc1==undefined?'0':ore.perc1):'0',
              perc2: lastread?(ore.perc2==''||ore.perc2==undefined?'0':ore.perc2):'0',
              perc3: lastread?(ore.perc3==''||ore.perc3==undefined?'0':ore.perc3):'0',
            })
            this.ch+=1
            if (this.ch == this.length) res('ok')
          })
        })
      })
    })
  }

  certiq(){
    if(!this.isMobile){
    this.info=[]
    this.sortedData=[]
    this.isThinking=true
    let params = new HttpParams().set("day",moment(new Date()).format('YYYY-MM-DD'))
    this.http.get('https://episjobreq.herokuapp.com/certiq/',{params:params}).subscribe(a=>{
      if(a){
        let b = Object.values(a)
        let d=b.filter(el=>{
          if(el.machineSerialNr!=undefined) return el
          return false
        })
        d.map((fa: any)=>{
          if(fa.serviceStep>0) fa.machineHrs = fa.serviceStep - fa.hoursLeftToService
          if(fa.serviceStep % 1500==0) {
            fa.serviceStep += ' (C-1500)'
          } else if(fa.serviceStep % 500==0) {
            fa.serviceStep += ' (B-500)'
          } else if(fa.serviceStep % 250==0) {
            fa.serviceStep  += ' (A-250)'
          } else {
            fa.serviceStepABC = ''
          }
        })
        this.info=d.slice()
        this.isThinking=false
        
        firebase.database().ref('Certiq/notes').on('value',df=>{
          this.certiqN=df.val()
        })
        setTimeout(() => {
          this.info.forEach((de:any)=>{
            if(this.certiqN[de.machineSerialNr]) {
              de.machineNote = this.certiqN[de.machineSerialNr].note
            } else {
              de.machineNote = 1
            }
          })
        }, 200);
        setTimeout(() => {
          this.sortedData=this.info.slice()
        }, 500);
      }
    })
    }   
    
  }

  onResize(){
    if(window.innerWidth<100) {
      this.isMobile=true
    } else {
      this.isMobile=false
    }
  }
  
  sfondo(a:any){
    if(a<=50) return 'backCR'
    if(a>50 && a<=100) return 'backCY'
    if(a>100) return 'backCG'
    return ''
  }

  sortData(sort: Sort) {
    const data = this.sortedData;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'serial': return compare(a.machineSerialNr, b.machineSerialNr, isAsc);
        case 'model': return compare(a.machineModel, b.machineModel, isAsc);
        case 'company': return compare(a.machineCompany, b.machineCompany, isAsc);
        case 'site': return compare(a.machineSite, b.machineSite, isAsc);
        case 'hrs': return compare(a.machineHrs, b.machineHrs, isAsc);
        case 'step': return compare(a.serviceStep, b.serviceStep, isAsc);
        case 'next': return compare(a.hoursLeftToService, b.hoursLeftToService, isAsc);
        case '.': return compare(a.hoursLeftToService, b.hoursLeftToService, isAsc);
        case 'pred': return compare(a.servicePredictedDate, b.servicePredictedDate, isAsc);
        case 'day': return compare(a.LastDayEngineHours, b.LastDayEngineHours , isAsc);

        default: return 0;
      }
    });
  }

  salva(e:any,b:string){
    this.sortedData.forEach((el: any) => {
      if(el.machineSerialNr==b) el.machineNote=e.target.value
    });
    firebase.database().ref('Certiq').child('notes').child(b).set({
      note: e.target.value
    })
  }

  filtra(){
    if(this.filt){
      this.sortedData = this.sortedData.filter((rt:any)=>{
        if(rt.machineNote!=1) return true
        return false
      })
    } else {
      this.sortedData=this.info.slice()
    }
    this.filt=!this.filt
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

