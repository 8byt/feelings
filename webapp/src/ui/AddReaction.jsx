import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Set } from 'immutable';

import createEmoji from '../common/utils/createEmoji';
import toJS from '../common/utils/toJS';

import { getFeelings } from '../data/feelings/selectors';
import { getPreviousReactions } from '../data/posts/selectors';
import { actions } from '../data/posts/actions';

const ReactionOption = ({ id, glyph, name, postReaction }) => (
  <div className='reaction-option' title={name} onClick={postReaction}>
    {createEmoji(glyph)}
  </div>
);

const ReactionOptionWrapper = connect(
  () => ({}),
  (dispatch, { path, id }) => ({
    postReaction: () => dispatch(actions.submitPost(path, id)),
  })
)(ReactionOption);

class AddReaction extends Component {
  state = { showEmojis: false }

  handleShowEmojis = () => {
    this.setState({ showEmojis: true });
  }

  handleHideEmojis = () => {
    this.setState({ showEmojis: false });
  }

  render() {
    const { feelings, path } = this.props;
    return (
      <div
        className='feeling-content add'
        onMouseEnter={this.handleShowEmojis}
        onMouseLeave={this.handleHideEmojis}
      >
        ＋
        <div className={`reaction-options${!this.state.showEmojis ? '' : ' visible'}`}>
          {feelings.map((feeling, idx) => (
            <ReactionOptionWrapper key={idx} {...feeling} path={path} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  (state, { path }) => {
    const previous = getPreviousReactions(state, path);
    return {
      feelings: getFeelings(state).filter(
        feeling => !previous.has(feeling.get('id'))
      ),
    };
  },
)(toJS(AddReaction));
