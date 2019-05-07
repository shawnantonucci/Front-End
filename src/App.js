import React from 'react';
import { Router } from '@reach/router';

import { firebase, db } from './firebase';

import Login from './components/Auth/Login';
import LandingPage from './components/LandingPage';
import SignUp from './components/Auth/SignUp';
import NavBar from './components/NavBar';
import DashMain from './components/DashMain';
import Footer from './components/Footer';
import ChooseCallPlan from './components/ChooseCallPlan';
import ChooseYourContact from './components/ChooseYourContact';
import ScheduleFreeCall from './components/ScheduleFreeCall';
import SchedulePaidCall from './components/SchedulePaidCall';
import CallConfirmation from './components/CallConfirmation';
import PreviousCalls from './components/dashboard/PreviousCalls';
import AboutUs from './components/AboutUs';
import UpdateAccount from './components/UpdateAccount';
import CallRecord from './components/dashboard/CallRecord';
import ContactInfo from './components/dashboard/ContactInfo';
import { fetchUser } from './app/utils';

import Global from './styles/Global';
import CSSReset from './styles/CSSReset';

function useAuth() {
  const [user, setUser] = React.useState(
    JSON.parse(window.localStorage.getItem('user') || null),
  );
  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        const updatedUser = await fetchUser(firebaseUser.uid);
        if (updatedUser) {
          const currentUser = {
            ...updatedUser,
          };
          setUser(currentUser);
          window.localStorage.setItem('user', JSON.stringify(currentUser));
          db.collection('users')
            .doc(currentUser.uid)
            .set(currentUser, { merge: true });
        } else if (firebaseUser) {
          const newUser = {
            displayName: firebaseUser.displayName,
            photoUrl: firebaseUser.photoURL,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          };
          setUser(newUser);
          window.localStorage.setItem('user', JSON.stringify(newUser));
          db.collection('users')
            .doc(newUser.uid)
            .set(newUser, { merge: true });
        }
      } else {
        setUser(null);
      }
    });
  }, []);
  // console.log(user);
  return user;
}

function App() {
  const user = useAuth();
  // console.log(user, 'USERRRRR');

  return user ? (
    <>
      <CSSReset />
      <Global />
      {/* <NavBar user={user} /> */}
      <Router>
        <DashMain user={user} path='/' exact />
        <ChooseYourContact user={user} path='/choose/:userId' />
        <ChooseCallPlan path='/choose/:userId/:contactId/call-plan' />
        <ScheduleFreeCall path='/choose/:userId/:contactId/:frequency/schedule-free' />
        <SchedulePaidCall path='/choose/:userId/:contactId/:frequency/schedule' />
        <CallConfirmation path='/confirmation/:contactId' />
        <PreviousCalls path='prev-calls/:userId' />
        <CallRecord path='prev-calls/:userId/:callId' />
        <AboutUs path='/about-us' />
        <UpdateAccount user={user} path='/account/:userId' />
        <ContactInfo user={user} path='/contact/:contactId/' />
      </Router>
      <Footer />
    </>
  ) : (
    <>
      <CSSReset />
      <Global />
      <Router>
        <LandingPage path='/' exact />
        <SignUp path='/signup' />
        <Login path='/login' />
      </Router>
    </>
  );
}

export default App;
