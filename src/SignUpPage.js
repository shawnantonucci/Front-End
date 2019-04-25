import React from 'react';
import { firebase, db } from './firebase';
import ChooseYourContact from './pages/ChooseYourContact';

function useAuth() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // this effect allows us to persist login
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
          .set(currentUser, { merge: true }); // merge adds safety
      } else {
        setUser(null);
      }
    });
  }, []);
  return user;
}
const SignUpPage = () => {
  const [authError, setAuthError] = React.useState(null);

  const user = useAuth();
  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setAuthError(error);
    }
  };
  return user ? (
    <ChooseYourContact user={user} />
  ) : (
    <div>
      <h2>You Are NOT Logged In</h2>
      <p>Recaller</p>
      <button type='button' onClick={handleSignIn}>
        Sign In With Google
      </button>
      {authError && (
        <div>
          <p>Sorry, there was a problem</p>
          <p>
            <i>{authError.message}</i>
          </p>
          <p>Please try again</p>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;