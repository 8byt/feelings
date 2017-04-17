import { Tracker } from 'meteor/tracker';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware as router } from 'react-router-redux';

import rootReducer from '../reducers';
import Posts from '../../imports/api/posts';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (...middleware) => {
    const store = createStore(rootReducer, composeEnhancers(
        applyMiddleware(...middleware)
    ));

    Tracker.autorun(() => {
        store.dispatch({
            type: 'SET_POSTS',
            posts: Posts.find().fetch()
        });
    });

    return store;
};
