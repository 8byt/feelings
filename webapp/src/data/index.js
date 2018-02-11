import { combineReducers } from 'redux-immutable';

import routerReducer from './router';

import feelings from './feelings/reducer';
import users from './users/reducer';
import posts from './posts/reducer';
import expanded from './expanded/reducer';

export const rootReducer = combineReducers({
  feelings,
  users,
  posts,
  expanded,
  router: routerReducer,
});
