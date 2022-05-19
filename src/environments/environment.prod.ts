export const environment = {
  workshops:[
    {val:'VER', desc: 'VERNIA SRL'},
    {val:'FEA', desc: 'F.E.A. SERVICE SRL'},
    {val:'DAS', desc: 'DAS SERVICE SRL'},
    {val:'OMI', desc: 'O.M.I. SRL'},
    {val:'AFM', desc: 'AF MAC & SERVICE SRL'},
    {val:'CAR', desc: 'OFFICINA CARUSO SRL'},
  ],
  appVersion: require('../../package.json').version,
  production: true,
  //url: 'http://localhost:3001/'
  url: 'https://episjobreq.herokuapp.com/'
  //url: '/api/'
};
