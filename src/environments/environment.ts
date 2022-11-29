// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appVersion: require('../../package.json').version + '-dev',
  production: false,
  workshops:[
    {val:'VER', desc: 'VERNIA SRL'},
    {val:'FEA', desc: 'F.E.A. SERVICE SRL'},
    {val:'DAS', desc: 'DAS SERVICE SRL'},
    {val:'OMI', desc: 'O.M.I. SRL'},
    {val:'AFM', desc: 'AF MAC & SERVICE SRL'},
    {val:'CAR', desc: 'OFFICINA CARUSO SRL'},
  ],
  imiFabiFam:[
		{name: '', val: 0},
		{name: 'Avviamento', val: 'Avviamento'},
		{name: 'Carro/Cabina', val: 'Carro/Cabina'},
		{name: 'Motore Diesel/Batteria', val: 'Motore Diesel/Batteria'},
		{name: 'RCS', val: 'RCS'},
		{name: 'Perforazione', val: 'Perforazione'},
		{name: 'Braccio Benna', val: 'Braccio Benna'},
		{name: 'Trasmissione', val: 'Trasmissione'},
		{name: 'Imp. Elettrico', val: 'Imp. Elettrico'},
		{name: 'Imp. Idraulico', val: 'Imp. Idraulico'},
		{name: 'Imp. Aria/Acqua', val: 'Imp. Aria/Acqua'},
    	{name: 'Imp. Antincendio', val:'Imp Antincendio'},
		{name: 'Braccio/Slitta', val: 'Braccio/Slitta'},
		{name: 'Perforatrice', val: 'Perforatrice'},
		{name: 'Bullonatura', val: 'Bullonatura'},
		{name: 'RigScan', val: 'RigScan'},
		{name: 'Stazione di ricarica', val: 'Stazione di ricarica'},
	],
  //url: 'http://localhost:3001/iyc/'
  url: 'https://episjobreq.herokuapp.com/iyc/'
  //url: '/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
