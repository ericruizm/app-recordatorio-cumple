import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCOhzh7jel11ec6tbnf7FK5U9NOGFX1icM',
  authDomain: 'birthday-6a909.firebaseapp.com',
  databaseURL: 'https://birthday-6a909.firebaseio.com',
  projectId: 'birthday-6a909',
  storageBucket: 'birthday-6a909.appspot.com',
  messagingSenderId: '796449598185',
  appId: '1:796449598185:web:874b317610dd8465b09e78',
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
