import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions as loginActions } from '../data/login/actions';
import { getLoginField } from '../data/login/selectors';

class LoginPage extends Component {
  state = { create: false }

  handleToggleMode = () => {
    this.setState({ create: !this.state.create });
  }

  render() {
    const {
      username,
      password,
      firstName,
      lastName,
      onChangeUsername,
      onChangePassword,
      onChangeFirstName,
      onChangeLastName,
      onSubmit,
    } = this.props;

    const { create } = this.state;

    return (
      <div className='login-window'>
        <form onSubmit={e => onSubmit(e, create)}>
          {create ?
            <div className='name-inputs'>
              <div>
                <h5>First Name</h5>
                <input type='text' value={firstName} onChange={onChangeFirstName} />
              </div>
              <div>
                <h5>Last Name</h5>
                <input type='text' value={lastName} onChange={onChangeLastName} />
              </div>
            </div>
            : null
          }
          <h5>Username</h5>
          <input type='text' value={username} onChange={onChangeUsername} />
          <h5>Password</h5>
          <input type='password' value={password} onChange={onChangePassword} />
          <button className='submit-button'>
            {create ? 'Create Account' : 'Log In'}
          </button>
        </form>
        <button onClick={this.handleToggleMode}>
          {create ? 'Log in as an existing user' : 'Create a new account'}
        </button>
      </div>
    );
  }
};

LoginPage.propTypes = {
  
};

const { editLoginField, submitLogin, submitNewAccount } = loginActions;

const wrapFieldHandler = (dispatch, field) => ({ target: { value } }) => {
  dispatch(editLoginField(field, value));
};

export default connect(
  state => ({
    username: getLoginField(state, 'username'),
    password: getLoginField(state, 'password'),
    firstName: getLoginField(state, 'firstName'),
    lastName: getLoginField(state, 'lastName'),
  }),
  dispatch => ({
    onChangeUsername: wrapFieldHandler(dispatch, 'username'),
    onChangePassword: wrapFieldHandler(dispatch, 'password'),
    onChangeFirstName: wrapFieldHandler(dispatch, 'firstName'),
    onChangeLastName: wrapFieldHandler(dispatch, 'lastName'),
    onSubmit: (e, create) => {
      e.preventDefault();
      if (create) {
        dispatch(submitNewAccount());
      } else {
        dispatch(submitLogin());
      }
    },
  })
)(LoginPage);
