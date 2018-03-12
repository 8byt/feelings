import React, { Component } from 'react';
import { connect } from 'react-redux';

import toJS from './common/utils/toJS';

import AddNewPost from './ui/AddNewPost';
import FeelingFeed from './ui/FeelingFeed';
import LoginWindow from './ui/LoginWindow';
import CurrentUserPanel from './ui/CurrentUserPanel';

import { getCurrentUserName } from './data/login/selectors';
import { actions as loginActions } from './data/login/actions';

import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    return (
      <div className="App">
        <AddNewPost />
        <FeelingFeed />
        {this.props.loggedIn ?
          <CurrentUserPanel />
          : <LoginWindow />
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    loggedIn: !!getCurrentUserName(state),
  }),
  dispatch => ({
    onLoad: () => dispatch(loginActions.checkUserSession()),
  })
)(toJS(App));
