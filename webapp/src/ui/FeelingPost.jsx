import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import createEmoji from '../common/utils/createEmoji';
import toJS from '../common/utils/toJS';

import ReactionLevel from './ReactionLevel';

import {
  getPostEmoji,
  getPosterName,
  getPostTimeAdded,
  getNumChildren,
} from '../data/posts/selectors';
import { getExpandedReaction } from '../data/expanded/selectors';
import { actions } from '../data/expanded/actions';

function FeelingPost({
  path,
  content,
  expandedPath,
  handleClick,
  userName,
  timeAdded,
  count,
  numChildren,
}) {
  const size = _.clamp(26 + 3 * (count - 1), 50);
  const nameRight = size * 3 / 2 + 10;
  const emojiLeft = 200 - (size * 3 / 4);
  const markerTop = (size * 3 / 4) - 6;
  const reactionsLeft = size * 3 / 2 + 11;
  const badgePos = _.clamp(count - 1, 8) / 3 * 2 - 3;

  const expanded = expandedPath.length && expandedPath[0] === path[0];

  return (
    <div className='feeling-post'>
      <div
        className='feeling-post-content'
        style={{ fontSize: `${size}px` }}
        onClick={handleClick}
      >
        {!expanded && <Fragment>
          <div className='feeling-post-name' style={{ right: nameRight }}>{userName}</div>
          <div className='feeling-post-date' style={{ left: nameRight }}>
            {moment(timeAdded).calendar()}
          </div>
        </Fragment>}
        {createEmoji(content)}
        {numChildren && !expanded ?
          <div className='badge large' style={{ bottom: badgePos, right: badgePos - 2 }}>
            {numChildren}
          </div>
          : null}
      </div>
        {expanded ?
          <div className='reactions' style={{ left: `${reactionsLeft}px` }}>
            <div className='reactions-marker' style={{ top: `${markerTop}px` }}/>
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
    numChildren: getNumChildren(state, path),
  }),
  (dispatch, { path }) => ({
    handleClick: () => dispatch(actions.toggleReactions(path)),
  })
)(toJS(FeelingPost));
