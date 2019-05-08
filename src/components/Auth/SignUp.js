import React from 'react';
import { Formik } from 'formik';
import { Link, navigate } from '@reach/router';
import { FaChevronRight } from 'react-icons/fa';

import { signup } from '../../app/utils';

import { Form } from '../../styles/Form';
import { Wrapper } from '../../styles/Login';
import { firebase } from '../../firebase';
import logo from '../../assets/images/icons8-google.svg';

const SignUp = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleGoogleSignUp = e => {
    e.preventDefault();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        setTimeout(() => {
          navigate(`/choose/${result.user.uid}`);
        }, 1000);
      })
      .catch(err => {
        console.log(`Error code: ${err.code}, Message: ${err.message}`);
      });
  };

  return (
    <Wrapper>
      <h1>ReCaller</h1>
      <p>
        Never forget to call your loved ones by creating a new ReCall, which
        will automatically call both you and a person of your choosing, and
        record the call for future review.
      </p>
      <p>Get started by letting us know your information below</p>
      <Formik
        initialValues={{
          email: '',
          phoneNumber: '',
          password: '',
          displayName: '',
        }}
        validate={values => {
          const errors = {};
          if (!values.password) {
            errors.password = 'Required';
          }
          if (!values.phoneNumber) {
            errors.phoneNumber = 'Required';
          }
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
            errors.password = 'Password should be at least 6 characters';
            errors.phoneNumber = 'Phone number is invalid';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            const id = await signup(values);
            setSubmitting(false);
            navigate(`/choose/${id}`);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <label htmlFor='displayName' className='sr'>
              Your Name
            </label>
            <input
              type='text'
              name='displayName'
              id='displayName'
              placeholder='Full Name'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.displayName}
            />
            <label htmlFor='email' className='sr'>
              Your E-mail Address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />

            {errors.email && touched.email && errors.email}
            <label htmlFor='phoneNumber' className='sr'>
              Your Phone Number
            </label>
            <input
              pattern='[1-9]{1}[0-9]{9}'
              type='text'
              name='phoneNumber'
              id='phoneNumber'
              placeholder='Phone'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phoneNumber}
            />
            {errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}
            <label htmlFor='phoneNumber' className='sr'>
              Choose a password
            </label>
            <input
              type='password'
              name='password'
              placeholder='Password'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {errors.password && touched.password && errors.password}
            <button type='submit' disabled={isSubmitting}>
              Choose Your Contact <FaChevronRight />
            </button>
            <button type='button' onClick={handleGoogleSignUp}>
              <img src={logo} alt='Google logo' />
              <span>Sign Up with Google</span>
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Already have an account?&nbsp;
        <Link to='/login'>Login</Link>
      </p>
    </Wrapper>
  );
};

export default SignUp;