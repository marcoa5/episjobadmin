// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appVersion: require('../../package.json').version + '-dev',
  production: false,
  appearance: 'fill',
  workshops:[
    {val:'VER', desc: 'VERNIA SRL'},
    {val:'FEA', desc: 'FEA SERVICE SRL'},
    {val:'OMI', desc: 'OMI SRL'},
    {val:'AFM', desc: 'AFMAC SRL'},
  ],
  //url: 'http://localhost:3001/'
  url: 'https://episjobreq.herokuapp.com/'
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
