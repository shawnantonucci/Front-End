import React, { useState } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';

import { Scheduler } from '../styles/Scheduler';

import { db } from '../firebase';

const SchedulePaidCall = ({ userId, contactId, frequency }) => {
  const initialState = {
    timezone: moment.tz.guess(),
    selected_time: '',
    day: '',
  };

  const [time, setTime] = useState(initialState);

  const handleChange = e => {
    setTime({
      ...time,
      [e.target.id]: e.target.value,
    });
    console.log(time);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const scheduledTime = moment(time.selected_time, 'HH:mm').format('h:mm A');
    let nextCall = moment
      .tz(`${time.day} ${scheduledTime}`, 'dddd h:mm A', time.timezone)
      .utc()
      .toDate();
    if (nextCall < moment().toDate()) {
      nextCall = moment(nextCall)
        .add(1, 'w')
        .toDate();
    }
    try {
      const docRef = await db.collection('contacts').add({
        call_frequency: frequency,
        call_type: 'paid',
        next_call: nextCall,
        timezone: time.timezone,
        scheduled_day: time.day,
        scheduled_time: scheduledTime,
        user1: db.collection('users').doc(userId),
        user2: db.collection('users').doc(contactId),
        created_at: moment().toDate(),
        updated_at: moment().toDate(),
      });
      navigate(`/confirmation/${docRef.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Scheduler>
      <h2>Schedule a call</h2>
      <p>
        ReCaller will only call you and your loved one at your selected time.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor='day'>Choose a day of the week</label>
        <select id='day' value={time.day} onChange={handleChange}>
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>
        <label htmlFor='selected_time'>Time</label>
        <input
          type='time'
          id='selected_time'
          value={time.selected_time}
          onChange={handleChange}
        />
        <label htmlFor='timezone'>Your time zone</label>
        <select id='timezone' value={time.timezone} onChange={handleChange}>
          <option>{time.timezone}</option>
          <option value='US/Alaska'>Alaska</option>
          <option value='US/Aleutian'>Aleutian</option>
          <option value='US/Arizona'>Arizona</option>
          <option value='US/Central'>Central</option>
          <option value='US/East-Indiana'>East-Indiana</option>
          <option value='US/Eastern'>Eastern</option>
          <option value='US/Hawaii'>Hawaii</option>
          <option value='US/Indiana-Starke'>Indiana-Starke</option>
          <option value='US/Michigan'>Michigan</option>
          <option value='US/Mountain'>Mountain</option>
          <option value='US/Pacific'>Pacific</option>
          <option value='US/Pacific-New'>Pacific-New</option>
        </select>
        <button type='submit'>Save &amp; Continue</button>
      </form>
    </Scheduler>
  );
};

SchedulePaidCall.propTypes = {
  userId: PropTypes.string,
  contactId: PropTypes.string,
  frequency: PropTypes.string,
};

export default SchedulePaidCall;
