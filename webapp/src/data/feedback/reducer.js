import { Map } from 'immutable';

import { types } from './actions';

const initialState = Map({
  display: false,
  content: '',
});

export default function feedbackReducer(state = initialState, action) {
  switch (action.type) {
    case types.TOGGLE_FEEDBACK_FORM:
      return state.set('display', !state.get('display'));

    case types.EDIT_FEEDBACK:
      return state.set('content', action.payload.value);

    case types.COMPLETE_FEEDBACK:
      return state.set('display', false);

    default:
      return state;
  }
}
