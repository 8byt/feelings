import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions as loginActions } from '../data/login/actions';
import { getLoginField } from '../data/login/selectors';

function LoginWindow({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onSubmit,
}) {
  return (
    <div className='login-window'>
      <form onSubmit={onSubmit}>
        <h5>Username</h5>
        <input type='text' value={username} onChange={onChangeUsername} />
        <h5>Password</h5>
        <input type='password' value={password} onChange={onChangePassword} />
        <button value='Log In' className='submit-button'>Log In</button>
      </form>
    </div>
  );
};

LoginWindow.propTypes = {
  
};

const { editLoginField, submitLogin } = loginActions;

export default connect(
  state => ({
    username: getLoginField(state, 'username'),
    password: getLoginField(state, 'password'),
  }),
  dispatch => ({
    onChangeUsername: ({ target: { value } }) => dispatch(editLoginField('username', value)),
    onChangePassword: ({ target: { value } }) => dispatch(editLoginField('password', value)),
    onSubmit: e => {
      e.preventDefault();
      dispatch(submitLogin());
    },
  })
)(LoginWindow);
