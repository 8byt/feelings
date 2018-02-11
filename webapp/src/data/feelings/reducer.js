import { Map, fromJS } from 'immutable';

import { types } from './actions';

export default function feelingsReducer(state = Map(), action) {
  switch (action.type) {
    case types.LOAD_FEELINGS:
      return fromJS(action.payload.feelings).reduce((all, feeling) => {
        return all.set(feeling.get('id'), feeling);
      }, Map());

    default:
      return state;
  }
}
