export const environment = {
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
  appVersion: require('../../package.json').version,
  production: true,
  //url: 'http://localhost:3001/iyc/'
  url: 'https://episjobreq.herokuapp.com/iyc/'
  //url: '/api/'
};
