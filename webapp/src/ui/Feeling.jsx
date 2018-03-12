import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import toJS from '../common/utils/toJS';

import { isOnPath } from '../data/expanded/selectors';
import { actions as expandedActions } from '../data/expanded/actions';

function Feeling({ emoji, toggleReactions, badge, onPath }) {
  return (
    <div className='feeling'>
      <div className='feeling-content' onClick={!badge ? toggleReactions : () => {}}>
        {emoji}
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
  (state, { path }) => ({ onPath: path && isOnPath(state, path) }),
  (dispatch, { path }) => ({
    toggleReactions: () => dispatch(toggleReactions(path)),
  })
)(Feeling);