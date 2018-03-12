import { List, fromJS } from 'immutable';

import { types } from './actions';

export default function (state = List(), { type, payload }) {
  switch (type) {
    case types.LOAD_POSTS:
      return fromJS(payload.posts || []);

    default:
      return state;
  }
}
