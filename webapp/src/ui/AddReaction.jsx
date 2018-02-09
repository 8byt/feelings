import React, { Component } from 'react';
import { connect } from 'react-redux';

import toJS from '../common/utils/toJS';

import { getFeelings } from '../data/feelings/selectors';

const ReactionOption = ({ id, glyph }) => (
  <div className='reaction-option'>{glyph}</div>
);

const ReactionOptionWrapper = connect(
  () => ({}),
  (dispatch, { id, path }) => ({
    postReaction: () => dispatch()
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
            <ReactionOption key={idx} {...feeling} path={path} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ feelings: getFeelings(state) }),
)(toJS(AddReaction));
