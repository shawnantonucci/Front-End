import React from 'react';
import { Router, Redirect } from '@reach/router';
import ChooseYourContact from './components/ChooseYourContact';
import { firebase, db } from './firebase';
import Login from './components/Login';
import DashBoard from './components/DashBoard';
import ScheduleFreeCall from './components/ScheduleFreeCall';
import SchedulePaidCall from './components/SchedulePaidCall';
import ChooseCallPlan from './components/ChooseCallPlan';
import CallConfirmation from './components/CallConfirmation';
import AboutUs from './components/AboutUs';
import Payment from './components/Payment';

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
        <Redirect from='/' to={`user/${user.uid}`} noThrow />
        <DashBoard user={user} path='/user/:userId' />
        <ChooseYourContact user={user} path='/choose/:userId' />
        <ChooseCallPlan path='/choose/:userId/:contactId/call-plan' />
        <ScheduleFreeCall path='/choose/:userId/:contactId/:frequency/schedule-free' />
        <SchedulePaidCall path='/choose/:userId/:contactId/:frequency/schedule' />
        <Payment path='/payment/:contactId' />
        <CallConfirmation path='/confirmation/:contactId' />
        <AboutUs path='/about-us' />
      </Router>
    </>
  ) : (
    <>
      <Login />
    </>
  );
}

export default App;
