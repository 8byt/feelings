import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import toJS from '../common/utils/toJS';

import ReactionLevel from './ReactionLevel';

import { getPostEmoji, getPosterName } from '../data/posts/selectors';
import { getExpandedReaction } from '../data/expanded/selectors';
import { actions } from '../data/expanded/actions';

const FeelingPost = ({ path, userName, content, expandedPath, handleClick }) => (
  <div className='feeling-post'>
    <div className='feeling-post-content' onClick={handleClick}>{content}</div>
    {expandedPath.length && expandedPath[0] === path[0] ?
      expandedPath.map((_, idx, arr) => (
        <ReactionLevel userName={userName} path={arr.slice(0, idx + 1)} />
      ))
      : null}
  </div>
);

FeelingPost.propTypes = {

};

export default connect(
  (state, { path }) => ({
    userName: getPosterName(state, path),
    content: getPostEmoji(state, path),
    expandedPath: getExpandedReaction(state),
  }),
  (dispatch, { path }) => ({
    handleClick: () => dispatch(actions.toggleReactions(path)),
  })
)(toJS(FeelingPost));
