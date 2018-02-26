import { Map, fromJS } from 'immutable';

// import { types } from './actions';
import { types as postActionTypes } from '../posts/actions';

export default function usersReducer(state = Map(), { type, payload }) {
  switch (type) {
    case postActionTypes.LOAD_POSTS:
      return fromJS(payload.users).reduce(
        (all, elem) => all.set(elem.get('id'), elem),
        Map()
      );
    default:
      return state;
  }
}
