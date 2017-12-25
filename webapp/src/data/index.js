import { combineReducers } from 'redux-immutable';

import routerReducer from './router';

import posts from './posts/reducer';

export const rootReducer = combineReducers({
  posts,
  router: routerReducer,
});
