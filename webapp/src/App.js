import React from 'react';
import { connect } from 'react-redux';

import FeelingsList from './ui/FeelingsList';
import toJS from './common/utils/toJS';

import { getPosts } from './data/posts/selectors';

import './App.css';

const App = ({ posts }) => (
  <div className="App">
    <FeelingsList feelings={posts} isTopLevel={true} />
  </div>
);

const mapStateToProps = state => ({
  posts: getPosts(state),
});

export default connect(mapStateToProps)(toJS(App));
