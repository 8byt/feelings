import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from './data';
import mockState from './data/mockState';

export default function configureStore(history) {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(
      thunkMiddleware,
      routerMiddleware(history),
    ))
  );
}
