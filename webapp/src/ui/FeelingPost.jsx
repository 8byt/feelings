import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FeelingList from './FeelingList';

import { getPostEmoji, getPosterName } from '../data/posts/selectors';

const FeelingPost = ({ path, userName, content }) => (
  <div className='feeling-post'>
    <div className='feeling-post-title'>{userName}</div>
    <div className='feeling-post-content'>{content}</div>
    <FeelingList topLevel path={path} />
  </div>
);

FeelingPost.propTypes = {

};

export default connect(
  (state, { path }) => ({
    userName: getPosterName(state, path),
    content: getPostEmoji(state, path),
  }),
)(FeelingPost);
