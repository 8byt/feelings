import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import toJS from '../common/utils/toJS';

import Feeling from './Feeling';

import { getEmoji } from '../data/feelings/selectors';
import { getChildrenOfType } from '../data/posts/selectors';
import { shouldExpandGroup } from '../data/expanded/selectors';
import { actions as expandedActions } from '../data/expanded/actions';

class FeelingGroup extends Component {
  state = { hover: false }

  handleExpand = () => {
    this.setState({ hover: true });
  }

  handleCollapse = () => {
    this.setState({ hover: false });
  }

  render() {
    const { emoji, posts, path, expanded } = this.props;

    let children = <Feeling path={_.concat(path, posts)} emoji={emoji} />;
    if (posts.length > 1) {
      if (this.state.hover || expanded) {
        children = posts.map(index => (
          <Feeling path={_.concat(path, index)} emoji={emoji} key={index} />
        ));
      } else {
        children = <Feeling emoji={emoji} badge={posts.length} />;
      }
    }

    return (
      <div
        className='feeling-group'
        onMouseEnter={this.handleExpand}
        onMouseLeave={this.handleCollapse}
      >
        {children}
      </div>
    );
  }
}

export default connect(
  (state, { feelingId, path }) => ({
    emoji: getEmoji(state, feelingId),
    posts: getChildrenOfType(state, path, feelingId),
    expanded: shouldExpandGroup(state, path, feelingId),
  })
)(toJS(FeelingGroup));
