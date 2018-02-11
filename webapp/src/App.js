import React, { Component } from 'react';
import { connect } from 'react-redux';

import FeelingFeed from './ui/FeelingFeed';
import toJS from './common/utils/toJS';

import { getPosts } from './data/posts/selectors';
import { actions } from './data/login/actions';
import { actions as feelingActions } from './data/feelings/actions';

import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.submitLogin({ username: 'sam@students.olin.edu', password: 'wat' });
    this.props.getFeelings();
  }

  render() {
    return (
      <div className="App">
        <FeelingFeed />
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    submitLogin: credentials => dispatch(actions.submitLogin(credentials)),
    getFeelings: () => dispatch(feelingActions.fetchFeelings()),
  })
)(toJS(App));
