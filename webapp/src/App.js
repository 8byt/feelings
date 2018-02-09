import React from 'react';
import { connect } from 'react-redux';

import FeelingFeed from './ui/FeelingFeed';
import toJS from './common/utils/toJS';

import { getPosts } from './data/posts/selectors';

import './App.css';

const App = ({ posts }) => (
  <div className="App">
    <FeelingFeed />
  </div>
);

const mapStateToProps = state => ({
  posts: getPosts(state),
});

export default connect(mapStateToProps)(toJS(App));
