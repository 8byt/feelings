import React, { Component } from 'react';
import { connect } from 'react-redux';

import FeelingFeed from './ui/FeelingFeed';
import LoginWindow from './ui/LoginWindow';
import toJS from './common/utils/toJS';

import { getPosts } from './data/posts/selectors';
import { actions as loginActions } from './data/login/actions';
import { actions as feelingActions } from './data/feelings/actions';
import { actions as postActions } from './data/posts/actions';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <FeelingFeed />
        <LoginWindow />
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({})
)(toJS(App));
