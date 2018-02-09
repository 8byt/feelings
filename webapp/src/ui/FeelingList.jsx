import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Popup, Accordion, Icon } from 'semantic-ui-react';

import AddReaction from './AddReaction';

import {
  getPostEmoji,
  getPosterName,
  getNumReactions,
  isFirstOfType,
  getNumFeelingsOfType,
} from '../data/posts/selectors';

import { shouldShowReactions } from '../data/expanded/selectors';
import { actions as expandedActions } from '../data/expanded/actions';

function Feeling({
  emoji,
  userName,
  path,
  firstOfType,
  numOfType,
  showReactions,
  toggleReactions
}) {
  const showBadge = numOfType > 1;
  return (
    <div className={`feeling${!firstOfType ? ' hidden' : ''}`}>
      <div
        className={`feeling-content${showBadge ? ' wide' : ''}`}
        onClick={toggleReactions}
      >
        {emoji}
        {showBadge && <div className='feeling-count'>{numOfType}</div>}
      </div>
      {/* userName */}
      {showReactions && <FeelingListWrapper path={path} />}
    </div>
  );
}

Feeling.propTypes = {
  
};

const { toggleReactions } = expandedActions;

const mapStateToProps = (state, { path }) => ({
  emoji: getPostEmoji(state, path),
  userName: getPosterName(state, path),
  firstOfType: isFirstOfType(state, path),
  numOfType: getNumFeelingsOfType(state, path),
  showReactions: shouldShowReactions(state, path),
});

const mapDispatchToProps = (dispatch, { path }) => ({
  toggleReactions: () => dispatch(toggleReactions(path)),
});

const FeelingWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(Feeling);


const FeelingList = ({ path, numFeelings, topLevel }) => {
  if (!numFeelings) return null;

  return (
    <div className={`feeling-list${topLevel ? ' top-level' : ''}`}>
      {_.range(numFeelings).map(index => (
        <FeelingWrapper key={index} path={_.concat(path, index)} />
      ))}
      <div className='feeling' style={{ marginLeft: 'auto' }}>
        <AddReaction path={path} />
      </div>
    </div>
  );
}

const FeelingListWrapper = connect(
  (state, { path }) => ({ numFeelings: getNumReactions(state, path) }),
)(FeelingList);

export default FeelingListWrapper;
