import { Map } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = Map({ location: null });

export default function routerReducer(
  state = initialState,
  { type, payload } = {},
) {
  if (type === LOCATION_CHANGE) {
    return state.set('location', payload);
  }
  return state;
}
