import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import toJS from '../common/utils/toJS';

import { getCurrentUserName } from '../data/login/selectors';
import { actions as loginActions } from '../data/login/actions';

const CurrentUserPanel = ({ name, onLogOut }) => (
  name ?
    <div className='current-user-panel'>
      <div>Logged in as {name}</div>
      <button onClick={onLogOut}>Log Out</button>
    </div>
    : <div className='current-user-panel'>Logged out</div>
);

CurrentUserPanel.propTypes = {
  
};

export default connect(
  state => ({
    name: getCurrentUserName(state),
  }),
  dispatch => ({
    onLogOut: () => dispatch(loginActions.logOut()),
  })
)(toJS(CurrentUserPanel));
