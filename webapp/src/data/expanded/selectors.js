import { List, is } from 'immutable';
import _ from 'lodash';

import { getChildrenOfType } from '../posts/selectors';

export const getExpandedReaction = state => state.get('expanded');

export const isOnPath = (state, path) => {
  const expandedPath = state.get('expanded').toArray();
  return _.isEqual(expandedPath.slice(0, path.length), path);
};

export const shouldExpandGroup = (state, path, feelingId) => {
  const children = getChildrenOfType(state, path, feelingId).toArray();
  const expandedPath = state.get('expanded').toArray();
  if (!isOnPath(state, path)) return false;
  if (expandedPath.length === path.length) return false;
  return _.some(children, child => child === expandedPath[path.length]);
};
