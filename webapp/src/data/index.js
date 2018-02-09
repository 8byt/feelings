import { combineReducers } from 'redux-immutable';

import routerReducer from './router';

import posts from './posts/reducer';
import hover from './hover/reducer';
import expanded from './expanded/reducer';

export const rootReducer = combineReducers({
  posts,
  hover,
  expanded,
  router: routerReducer,
});
