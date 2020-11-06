// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAamHmL9217JSR_uaoU9Q3L5c7v3t0kfuY",
    authDomain: "agrega-app.firebaseapp.com",
    databaseURL: "https://agrega-app.firebaseio.com",
    projectId: "agrega-app",
    storageBucket: "agrega-app.appspot.com",
    messagingSenderId: "700603536900",
    appId: "1:700603536900:web:76e27fab5d8804e3"
  },
  algolia: {
    appId: "VEO973JMRF",
    appKey: "c2ae6bc3caa1381bd7baf6c0241395cd"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
