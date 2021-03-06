import React from 'react';
import { Router } from '@reach/router';
import styled from 'styled-components';

import { firebase, db } from './firebase';
import LandingPageMain from './components/Landing';
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
import Billing from './components/dashboard/Billing';
import UpdateContact from './components/scheduler/UpdateContact';
import LandingFooter from './components/Landing/LandingFooter';
import Pre from './components/Landing/Pre';

import { fetchUser } from './app/utils';

import Global from './styles/Global';

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
  return user;
}

function App() {
  const user = useAuth();

  return user ? (
    <>
      <Global />
      <Wrapper>
        <NavBar user={user} />
        <Router className='content'>
          <DashMain user={user} path='/' exact />
          <ChooseYourContact user={user} path='/choose/:userId' />
          <ChooseCallPlan path='/choose/:userId/:contactId/call-plan' />
          <ScheduleFreeCall path='/choose/:userId/:contactId/:frequency/schedule-free' />
          <SchedulePaidCall
            user={user}
            path='/choose/:userId/:contactId/:frequency/schedule'
          />
          <CallConfirmation path='/confirmation/:contactId' />
          <PreviousCalls userId={user.uid} path='/prev-calls/:userId' />
          <CallRecord path='/prev-calls/:userId/:callId' />
          <AboutUs path='/about-us' />
          <UpdateAccount user={user} path='/account/:userId' />
          <ContactInfo user={user} path='/contact/:contactId/' />
          <Billing user={user} path='/billing/:userId' />
          <UpdateContact user={user} path='/contact/:contactId/update' />
        </Router>
      </Wrapper>
      <Footer user={user} />
    </>
  ) : (
    <>
      <Global />
      <Wrapper>
        <Router>
          <LandingPageMain path='/' exact />
          <Pre path='/*' />
        </Router>
      </Wrapper>
      <LandingFooter />
    </>
  );
}

export default App;

const Wrapper = styled.div`
  flex: 1 0 auto;
`;
