
import React from 'react';
import ReactDOM from 'react-dom';

// Component Imports
import App from './containers/app';

// Redux Related Imports
import { Provider } from 'react-redux';
import configureStore from './store/configStore';

const store = configureStore();

// Implementing React Router
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);