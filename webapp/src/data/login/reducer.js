import { Map, fromJS } from 'immutable';

import { types } from './actions';

const initialState = fromJS({
  fields: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  currentUser: {},
});

export default function loginReducer(state = initialState, { type, payload, error }) {
  switch (type) {
    case types.SET_CURRENT_USER:
      if (!error) {
        return state.set('currentUser', fromJS(payload.currentUser));
      }
      return state;

    case types.EDIT_LOGIN_FIELD:
      return state.setIn(['fields', payload.field], payload.value);

    default:
      return state;
  }
}
