import React, { Component } from 'react';
import { connect } from 'react-redux';

import toJS from '../common/utils/toJS';

import { getFeelings } from '../data/feelings/selectors';
import { actions } from '../data/posts/actions';

const ReactionOption = ({ id, glyph, postReaction }) => (
  <div className='reaction-option' onClick={postReaction}>{glyph}</div>
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
  state => ({ feelings: getFeelings(state) }),
)(toJS(AddReaction));
