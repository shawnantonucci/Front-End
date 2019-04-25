import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { firebase, db } from '../firebase';
import useDoc from '../hooks/useDoc';

export const DisplayFormikState = props => (
  <div style={{ margin: '1rem 0' }}>
    <h3 style={{ fontFamily: 'monospace' }} />
    <pre
      style={{
        background: '#f6f8fa',
        fontSize: '.65rem',
        padding: '.5rem',
      }}
    >
      <strong>props</strong> = {JSON.stringify(props, null, 2)}
    </pre>
  </div>
);
const ChooseYourContact = ({ user }) => {
  const [newUser, setNewUser] = React.useState(null);
  console.log(newUser, 'NEW');
  React.useEffect(() => {
    if (newUser) {
      db.doc(`users/${user.uid}`).update({
        contact: {
          email: newUser.email,
          name: newUser.displayName,
          phoneNumber: newUser.phoneNumber,
        },
        // [`channels.${channelId}`]: newUser, // <-- deep update using a firebase api
        // channels: {
        // 	[channelId]: true, // computed property <-- would override same value
        // },
      });
    }
  }, [newUser, user.uid]);
  const currentUserData = useDoc(`users/${user.uid}`);
  const updateUser = values => {
    const formattedPhone = String('+1').concat(
      String(values.phoneNumber).replace(/[^\d]/g, ''),
    );
    const contactProp = [{ ...values, phoneNumber: formattedPhone }];
    const newContact = contactProp.map(obj => {
      return Object.assign({}, obj);
    });

    const userWithContact = {
      ...user,
      contact: newContact,
    };
    console.log(userWithContact, '$$$$$$$$$$$$');
    setNewUser({ ...user, contact: newContact });
  };

  // console.log(currentUserData, 'CURRENT');

  if (currentUserData) {
    if (currentUserData.contact) {
      return <div>Hello</div>;
    }
  }
  return (
    <>
      <div>Hello {user.displayName} </div>
      <div className='app'>
        <h1>Choose Your Loved One</h1>
        <button
          type='button'
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          log out
        </button>

        <Formik
          initialValues={{ email: '', name: '', phoneNumber: null }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              updateUser(values);
              setSubmitting(false);
            }, 500);
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required('Required'),
            name: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required'),
            phoneNumber: Yup.number().required('Required'),
          })}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <label htmlFor='email' style={{ display: 'block' }}>
                  Email
                </label>
                <input
                  id='email'
                  placeholder='Enter your email'
                  type='text'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className='input-feedback'>{errors.email}</div>
                )}
                <label htmlFor='name' style={{ display: 'block' }}>
                  Name
                </label>
                <input
                  id='name'
                  placeholder='Enter your name'
                  type='text'
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.name && touched.name && (
                  <div className='input-feedback'>{errors.name}</div>
                )}
                <label htmlFor='phoneNumber' style={{ display: 'block' }}>
                  Phone Number
                </label>
                <input
                  id='phoneNumber'
                  placeholder='Enter your phone number'
                  type='number'
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.phoneNumber && touched.phoneNumber
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <div className='input-feedback'>{errors.phoneNumber}</div>
                )}
                <button
                  type='button'
                  className='outline'
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </button>
                <button type='submit' disabled={isSubmitting}>
                  Submit
                </button>

                <DisplayFormikState {...props} />
              </form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default ChooseYourContact;

ChooseYourContact.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoUrl: PropTypes.string,
    uid: PropTypes.string,
  }),
};
