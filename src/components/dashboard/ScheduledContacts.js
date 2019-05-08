/* eslint-disable no-inner-declarations */
import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { db } from '../../firebase';
import { Link } from '@reach/router';

const ScheduledContacts = ({ user }) => {
  const [contacts, setContacts] = React.useState([]);
  const { uid } = user;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userContacts = await db
          .collection('contacts')
          .where('user1', '==', db.doc(`users/${uid}`))
          .get();
        console.log(userContacts, 'userContacts');
        userContacts.forEach(async doc => {
          try {
            const user2Snap = await db
              .doc(`users/${doc.data().user2.id}`)
              .get();
            const contact = {
              user2: {
                ...user2Snap.data(),
                id: user2Snap.id,
              },
              call_frequency: doc.data().call_frequency,
              next_call: doc.data().next_call,
              time_zone: doc.data().timezone,
              id: doc.id,
            };
            setContacts(contacts => [...contacts, contact]);
          } catch (err) {
            console.log(err);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [uid]);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div>Name</div>
        <div>Date</div>
        <div>Time</div>
      </div>
      {contacts &&
        contacts.map(c => {
          return (
            <div style={{ display: 'flex' }}>
              {c.user2.displayName}{' '}
              {moment(c.next_call, 'X')
                .tz(c.time_zone)
                .format(`h:mm A`)}{' '}
              {moment(c.next_call, 'X')
                .tz(c.time_zone)
                .format(`MMMM Do, YYYY`)}
            </div>
          );
        })}
    </>
    contacts &&
    contacts.map((c, index) => {
      return (
        <Table key={index}>
          <thead>
            <tr style={{ display: 'flex', justifyContent: 'space-around' }}>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ display: 'flex', justifyContent: 'space-around' }}>
              <td>{c.user2.displayName}</td>
              <td style={{ width: '50%' }}>
                {' '}
                {moment(c.next_call, 'X')
                  .tz(c.time_zone)
                  .format(`h:mm A`)}
              </td>
              <td style={{ width: '50%' }}>
                {' '}
                {moment(c.next_call, 'X')
                  .tz(c.time_zone)
                  .format(`MMMM Do, YYYY`)}
              </td>
            </tr>
          </tbody>
        </Table>
      );
    })
  );
};

export default ScheduledContacts;

ScheduledContacts.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoUrl: PropTypes.string,
    uid: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
};
const Table = styled.div`
  max-width: 100%;

const Table = styled.div`
  max-width: 100%;
  /* background: red; */
  border: 1px solid black;
  padding: 5px;
  text-align: center;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
