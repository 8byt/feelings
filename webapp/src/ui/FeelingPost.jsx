import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import toJS from '../common/utils/toJS';

import ReactionLevel from './ReactionLevel';

import { getPostEmoji, getPosterName, getPostTimeAdded } from '../data/posts/selectors';
import { getExpandedReaction } from '../data/expanded/selectors';
import { actions } from '../data/expanded/actions';

const FeelingPost = ({ path, content, expandedPath, handleClick, userName, timeAdded }) => {
  const tooltip = `${userName}, ${moment(timeAdded).calendar()}`;
  return (
    <div className='feeling-post' title={tooltip}>
      <div className='feeling-post-content' onClick={handleClick}>{content}</div>
        {expandedPath.length && expandedPath[0] === path[0] ?
          <div className='reactions'>
            <div className='reactions-marker' />
            {expandedPath.map((_, idx, arr) => (
              <ReactionLevel path={arr.slice(0, idx + 1)} key={idx} />
            ))}
        </div>
          : null}
    </div>
  );
};

FeelingPost.propTypes = {

};

export default connect(
  (state, { path }) => ({
    content: getPostEmoji(state, path),
    expandedPath: getExpandedReaction(state),
    userName: getPosterName(state, path),
    timeAdded: getPostTimeAdded(state, path),
  }),
  (dispatch, { path }) => ({
    handleClick: () => dispatch(actions.toggleReactions(path)),
  })
)(toJS(FeelingPost));
