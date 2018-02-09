import { Map, List } from 'immutable';
import { createSelector } from 'reselect';

import { getEmoji } from '../feelings/selectors';
import { getUserName } from '../users/selectors';

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

export const getNumFeelingsOfType = (state, path) => {
  const feelingId = getPostFeeling(state, path);
  const siblings = getReactions(state, path.slice(0, -1));
  return siblings.filter(post => post.get('feelingId') === feelingId).size;
};

export const getPoster = (state, path) => getPost(state, path).get('userId');

export const getPostFeeling = (state, path) => getPost(state, path).get('feelingId');

export const getPosterName = (state, path) => getUserName(state, getPoster(state, path));

export const getPostEmoji = (state, path) => getEmoji(state, getPostFeeling(state, path));
