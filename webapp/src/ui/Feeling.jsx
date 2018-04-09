import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import createEmoji from '../common/utils/createEmoji';
import toJS from '../common/utils/toJS';

import { getPosterName, getPostTimeAdded } from '../data/posts/selectors';
import { isOnPath } from '../data/expanded/selectors';
import { actions as expandedActions } from '../data/expanded/actions';

function Feeling({ emoji: glyph, toggleReactions, badge, onPath, userName, timeAdded }) {
  const tooltip = userName ? `${userName}, ${moment(timeAdded).calendar()}` : undefined;
  return (
    <div className='feeling' title={tooltip}>
      <div className='feeling-content' onClick={!badge ? toggleReactions : () => {}}>
        {createEmoji(glyph)}
      </div>
      {badge ? <div className='badge'>{badge}</div> : null}
      {onPath ? <div className='path-marker' /> : null}
    </div>
  );
}

Feeling.propTypes = {
  
};

const { toggleReactions } = expandedActions;

export default connect(
  (state, { path }) => ({
    onPath: path && isOnPath(state, path),
    userName: path && getPosterName(state, path),
    timeAdded: path && getPostTimeAdded(state, path),
  }),
  (dispatch, { path }) => ({
    toggleReactions: () => dispatch(toggleReactions(path)),
  })
)(Feeling);