import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';

import App from '../imports/ui/App.jsx';
import createStore from './store';

const history = createHistory();
const router = routerMiddleware(history);

Meteor.startup(() => {
    render(
        <Provider store={createStore(thunk, router)}>
            <ConnectedRouter history={history}>
                <Route exact path="/" component={App}/>
            </ConnectedRouter>
        </Provider>,
        document.getElementById('render-target')
    );
});
