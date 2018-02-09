import { List, is } from 'immutable';

export const shouldShowReactions = (state, path) => is(
  state.get('expanded').slice(0, List(path).size),
  List(path)
);
