import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from '@reach/router';
import { db } from '../../firebase';
import styled from 'styled-components';

const ContactInfo = ({ contactId, user }) => {
  const [contact, setContact] = useState({});
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const contactSnap = await db.doc(`contacts/${contactId}`).get();
      const user1Snap = await db
        .doc(`users/${contactSnap.data().user1.id}`)
        .get();
      const user2Snap = await db
        .doc(`users/${contactSnap.data().user2.id}`)
        .get();
      setContact({
        ...contactSnap.data(),
        user1: {
          ...user1Snap.data(),
        },
        user2: {
          ...user2Snap.data(),
        },
        fetched: true,
      });
      const callSnaps = await db
        .collection('calls')
        .where('contact_ref', '==', db.doc(`contacts/${contactId}`))
        .get();
      callSnaps.forEach(doc => {
        const callData = {
          call_duration: doc.data().call_duration,
          call_time: doc.data().call_time,
          id: doc.id,
        };
        setCalls(calls => [...calls, callData]);
      });
    };
    fetchData();
  }, [contactId]);

  console.log(calls);
  return contact.fetched ? (
    <Container>
      <PreviousCalls>
        <h3>Previous Calls</h3>
        {calls.length &&
          calls.map(call => {
            return (
              <div key={call.id}>
                <div>
                  Call on{' '}
                  {moment(call.call_time, 'X')
                    .tz(contact.timezone)
                    .format('MMMM Do, YYY [at] h:mm A')}
                </div>
                <div>Call duration: {call.call_duration} seconds</div>
                <Link to={`/prev-calls/${user.uid}/${call.id}`}>
                  Review Call
                </Link>
              </div>
            );
          })}
      </PreviousCalls>
      <ScheduledBy>
        <div />
      </ScheduledBy>
      <NextCall>
        <p>Hello</p>
      </NextCall>
    </Container>
  ) : (
    <p>Loading...</p>
  );
};

const PreviousCalls = styled.aside`
  border: 1px solid #000000;
  grid-row: 2 / -1;
  grid-column: 1;
`;
const ScheduledBy = styled.div`
  border: 1px solid #000000;
  grid-row: 2 / -1;
  grid-column: 2;
`;
const NextCall = styled.div`
  border: 1px solid #000000;
  grid-row: 2 / -1;
  grid-column: 3;
`;
const Container = styled.div`
  display: grid;
  height: 85vh;
  grid-template-columns: 1fr 2fr 3fr;
  grid-template-rows: 70px 1fr;
`;

ContactInfo.propTypes = {
  contactId: PropTypes.string,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoUrl: PropTypes.string,
    uid: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
};

export default ContactInfo;
