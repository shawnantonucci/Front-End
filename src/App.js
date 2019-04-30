import React from 'react';
import { Router, Redirect } from '@reach/router';
import Choose from './components/Choose';
import { firebase, db } from './firebase';
import Login from './components/Login';
import DashBoard from './components/DashBoard';

function useAuth() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const currentUser = {
          displayName: firebaseUser.displayName,
          photoUrl: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        };
        setUser(currentUser);
        db.collection('users')
          .doc(currentUser.uid)
          .set(currentUser, { merge: true });
      } else {
        setUser(null);
      }
    });
  }, []);
  return user;
}

function App() {
  const user = useAuth();
  return user ? (
    <>
      <Router>
        <DashBoard user={user} path='/user/:userId' />
        <Choose user={user} path='/choose/:userId' />
        <Redirect from='/' to={`user/${user.uid}`} noThrow />
      </Router>
    </>
  ) : (
    <>
      <Login />
    </>
  );
}

export default App;
