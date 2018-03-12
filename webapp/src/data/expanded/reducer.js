import { List, is } from 'immutable';

import { types } from './actions';

export default function expandedReducer(state = List(), action) {
  const path = List(action.path);

  switch (action.type) {
    case types.TOGGLE_REACTIONS: {
      if (path.size > state.size) {
        return path;
      } else if (is(state.slice(0, path.size), path)) {
        return state.slice(0, path.size - 1);
      } else {
        return path;
      }
    }

    default:
      return state;
  }
}
