import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '@reach/router';
import { db } from '../../firebase';

const ScheduledContacts = ({ user }) => {
  const [call, setCall] = React.useState(null);
  const [contact, setContact] = React.useState(null);
  const [callInfo, setCallInfo] = React.useState(null);

  React.useEffect(() => {
    const { uid } = user;
    // console.log(uid, 'from contacts');

    const fetchData = async () => {
      const user = await db.collection('users').doc(uid);
      const userContacts = await db
        .collection('contacts')
        .where('user1', '==', user)
        .get();
      // console.log(userContacts.docs[0].id, 'from useEffect');

      await userContacts.forEach(async doc => {
        const allContacts = await db
          .collection('contacts')
          .where(`${userContacts.docs.id}`, '==', `${user.uid}`)
          .get();

        const arg = userContacts.docs;
        return db.doc('contacts/${arg}').onSnapshot(doc => {
          setContact({
            ...doc.data(),
            id: doc.id,
          });
        });
        // console.log(arg);
        // console.log(userContacts, 'from contacts');
      });
    };
    fetchData();
  }, [userContacts]);

  React.useEffect(() => {
    console.log(contact);
    return db.doc(`contacts/${arg}`).onSnapshot(document => {
      setCall({
        ...document.data(),
        id: document.id,
      });
    });
  }, [callId]);
  React.useEffect(() => {
    if (call) {
      function fetchCallInfo() {
        call.contact_ref.get().then(doc => {
          if (doc.exists) {
            setCallInfo({
              ...doc.data(),
              id: doc.id,
            });
          }
        });
      }
      fetchCallInfo();
    }
  }, [call]);
  React.useEffect(() => {
    if (callInfo) {
      function fetchContact() {
        callInfo.user2.get().then(doc => {
          if (doc.exists) {
            setContact({
              ...doc.data(),
              id: doc.id,
            });
          }
        });
      }
      fetchContact();
    }
  }, [callInfo]);
  if (!call) return <p>Loading..</p>;
  if (!callInfo) return <p>...</p>;
  if (!contact) return <p>...</p>;
  return (
    <>
      <h2>List of your contacts</h2>
      {console.log(contacts, 'from return')}
      {contacts &&
        contacts.map(contact => (
          <div key={contact.user1}>
            {/* <h3>Call with {contact.user2.displayName}</h3> */}
            <h3>At {contact.next_call}</h3>
          </div>
        ))}
    </>
  );
  //   <Card>
  //     <h2>Review your call with {contact.displayName}</h2>
  //     <Link to={`contact/${contact.id}`}>
  //       <Img src={contact.photoUrl} alt={contact.displayName} />
  //     </Link>
  //     <p>
  //       {moment(call.call_time.seconds).format('dddd, MMMM Do [at] h:mm A')}
  //     </p>
  //     <p>Listen to Call</p>
  //     <audio controls>
  //       <source src={call.audio} type='audio/wav' />
  //       <track kind='captions' />
  //       Your browser does not support the audio element
  //     </audio>
  //     <p>This call occurs {callInfo.call_frequency}</p>
  //     <p>
  //       Your next call is{' '}
  //       {moment(callInfo.next_call.seconds).format('dddd, MMMM Do [at] h:mm A')}{' '}
  //     </p>
  //   </Card>
  // );
};

export default CallRecord;
CallRecord.propTypes = {
  callId: PropTypes.string,
};
const Card = styled.div`
  transition: box-shadow 0.3s;
  margin: 25px 0;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #fff;
  &:hover {
    box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  }
`;
const Img = styled.img`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  float: right;
`;
