export const environment = {
  workshops:[
    {val:'VER', desc: 'VERNIA SRL'},
    {val:'FEA', desc: 'FEA SERVICE SRL'},
    {val:'OMI', desc: 'OMI SRL'},
    {val:'AFM', desc: 'AFMAC SRL'},
  ],
  appVersion: require('../../package.json').version,
  production: true,
  //url: 'http://localhost:3001/'
  url: 'https://episjobreq.herokuapp.com/'
  //url: '/api/'
};
