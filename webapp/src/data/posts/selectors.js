import { Map, List, Set } from 'immutable';
import _ from 'lodash';
import { createSelector } from 'reselect';

import { getEmoji } from '../feelings/selectors';
import { getUserName } from '../users/selectors';
import { getCurrentUserId } from '../login/selectors';

const getKeyPath = path => [].concat(...path.map(e => ['children', e])).slice(1);

export const getPosts = state => state.get('posts');

export const getPost = (state, path) => getPosts(state).getIn(getKeyPath(path), Map());

export const getReactions = (state, path) => getPost(state, path).get('children', List());

export const getNumReactions = (state, path) => getReactions(state, path).size;

export const isFirstOfType = (state, path) => {
  const feelingId = getPostFeeling(state, path);
  const siblings = getReactions(state, path.slice(0, -1));
  const firstIndex = siblings.findIndex(post => post.get('feelingId') === feelingId);
  return firstIndex === path[path.length - 1];
};

export const getPoster = (state, path) => getPost(state, path).get('userId');

export const getPostId = (state, path) => getPost(state, path).get('id');

export const getPostFeeling = (state, path) => getPost(state, path).get('feelingId');

export const getPostTimeAdded = (state, path) => getPost(state, path).get('timeAdded');

export const getPosterName = (state, path) => getUserName(state, getPoster(state, path));

export const getPostEmoji = (state, path) => getEmoji(state, getPostFeeling(state, path));

export const getNumChildren = (state, path) => getPost(state, path).get('children').size;

export const shouldShowFeeling = (state, path, expandedFeelings) => {
  const firstOfType = isFirstOfType(state, path);
  const expanded = _.includes(expandedFeelings, getPostFeeling(state, path));
  return firstOfType || expanded;
};

export const getNumFeelingsOfType = (state, path) => {
  const feelingId = getPostFeeling(state, path);
  const siblings = getReactions(state, path.slice(0, -1));
  return siblings.filter(post => post.get('feelingId') === feelingId).size;
};

export const getChildrenTypes = (state, path) => {
  return getReactions(state, path)
    .map(post => post.get('feelingId'))
    .toSet()
    .toList()
    .sort();
};

export const getChildrenOfType = (state, path, feelingId) => {
  return getReactions(state, path)
    .map((post, index) => post.set('index', index))
    .filter(post => post.get('feelingId') === feelingId)
    .map(post => post.get('index'));
};

export const shouldShowDuplicateCount = (state, path, expandedFeelings) => {
  const firstOfType = isFirstOfType(state, path);
  const expanded = _.includes(expandedFeelings, getPostFeeling(state, path));
  const numOfType = getNumFeelingsOfType(state, path);
  return firstOfType && numOfType > 1 && !expanded;
};

export const getPreviousReactions = (state, path) => {
  const userId = getCurrentUserId(state);
  const reactions = getReactions(state, path);
  const previous = reactions.reduce((all, post) => {
    if (post.get('userId') === userId) {
      return all.add(post.get('feelingId'));
    }
    return all;
  }, Set());
  return previous;
};

export const postedByCurrentUser = (state, path) => (
  getPoster(state, path) === getCurrentUserId(state)
);
