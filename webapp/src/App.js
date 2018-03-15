import React, { Component } from 'react';
import { connect } from 'react-redux';

import toJS from './common/utils/toJS';

import MainPage from './ui/MainPage';
import LoginPage from './ui/LoginPage';

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
        {this.props.loggedIn ?
          <MainPage />
          : <LoginPage />
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
