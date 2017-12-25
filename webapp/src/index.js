import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import configureStore from './configureStore';
import routes from './routes';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import 'semantic-ui-css/semantic.min.css';

const history = createHistory();

const store = configureStore(history);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
