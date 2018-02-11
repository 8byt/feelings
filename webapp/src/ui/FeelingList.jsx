import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Popup, Accordion, Icon } from 'semantic-ui-react';

import AddReaction from './AddReaction';

import {
  getPostFeeling,
  getPostEmoji,
  getPosterName,
  getNumReactions,
  shouldShowFeeling,
  shouldShowDuplicateCount,
  getNumFeelingsOfType,
} from '../data/posts/selectors';

import { shouldShowReactions } from '../data/expanded/selectors';
import { actions as expandedActions } from '../data/expanded/actions';

function Feeling({
  feelingId,
  emoji,
  userName,
  path,
  showFeeling,
  showCount,
  numOfType,
  showReactions,
  toggleReactions,
  expandFeeling,
  collapseFeeling,
}) {
  return (
    <div
      className={`feeling${!showFeeling ? ' hidden' : ''}`}
      onMouseEnter={numOfType > 1 && (() => expandFeeling(feelingId))}
      onMouseLeave={numOfType > 1 && (() => collapseFeeling(feelingId))}
    >
      <div
        className={`feeling-content${showCount ? ' wide' : ''}`}
        onClick={toggleReactions}
      >
        {emoji}
        {showCount && <div className='feeling-count'>{numOfType}</div>}
      </div>
      {/* userName */}
      {showReactions && <FeelingListWrapper path={path} />}
    </div>
  );
}

Feeling.propTypes = {
  
};

const { toggleReactions } = expandedActions;

const mapStateToProps = (state, { path, expandedFeelings }) => ({
  feelingId: getPostFeeling(state, path),
  emoji: getPostEmoji(state, path),
  userName: getPosterName(state, path),
  showFeeling: shouldShowFeeling(state, path, expandedFeelings),
  showCount: shouldShowDuplicateCount(state, path, expandedFeelings),
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


class FeelingList extends Component {
  state = { expandedFeelings: [] }

  handleExpandFeeling = feelingId => {
    this.setState({
      expandedFeelings: _.concat(this.state.expandedFeelings, feelingId)
    });
  }

  handleCollapseFeeling = feelingId => {
    this.setState({
      expandedFeelings: _.without(this.state.expandedFeelings, feelingId)
    });
  }

  render() {
    const { path, numFeelings, topLevel } = this.props;
    if (!numFeelings) return null;

    return (
      <div className={`feeling-list${topLevel ? ' top-level' : ''}`}>
        {_.range(numFeelings).map(index => (
          <FeelingWrapper
            key={index}
            path={_.concat(path, index)}
            expandedFeelings={this.state.expandedFeelings}
            expandFeeling={this.handleExpandFeeling}
            collapseFeeling={this.handleCollapseFeeling}
          />
        ))}
        <div className='feeling' style={{ marginLeft: 'auto' }}>
          <AddReaction path={path} />
        </div>
      </div>
    );
  }
}

const FeelingListWrapper = connect(
  (state, { path }) => ({ numFeelings: getNumReactions(state, path) }),
)(FeelingList);

export default FeelingListWrapper;
