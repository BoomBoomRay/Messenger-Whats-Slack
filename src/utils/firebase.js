const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

require('@firebase/auth');
require('@firebase/storage');
require('@firebase/database');

firebase.initializeApp({
  apiKey: 'AIzaSyCf9Y1RI-YVaZR0sLXZ3ZffkoW9895Xr9s',
  authDomain: 'messenger-app-a3906.firebaseapp.com',
  databaseURL: 'https://messenger-app-a3906.firebaseio.com',
  projectId: 'messenger-app-a3906',
  storageBucket: 'messenger-app-a3906.appspot.com',
  messagingSenderId: '334067623581',
  appId: '1:334067623581:web:d4442a678b89eeed039674',
});
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
export { auth, db, storage };

// FOR WHEN DEPLOYING =================================================================
// const app = require('@firebase/app');
// require('@firebase/auth');
// require('@firebase/firestore');
// require('@firebase/storage');

// const firebase = app.firebase;
// firebase.initializeApp({
//   apiKey: 'AIzaSyCf9Y1RI-YVaZR0sLXZ3ZffkoW9895Xr9s',
//   authDomain: 'messenger-app-a3906.firebaseapp.com',
//   databaseURL: 'https://messenger-app-a3906.firebaseio.com',
//   projectId: 'messenger-app-a3906',
//   storageBucket: 'messenger-app-a3906.appspot.com',
//   messagingSenderId: '334067623581',
//   appId: '1:334067623581:web:d4442a678b89eeed039674',
// });
// const auth = firebase.auth();
// const db = firebase.firestore();
// const storage = firebase.storage();
// export { auth, db, storage };
