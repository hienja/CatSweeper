
import React from 'react';
import ReactDOM from 'react-dom';

// Component Imports
import App from './containers/App';
import Main from './components/Main';

// Redux Related Imports
import { Provider } from 'react-redux';
import configureStore from './store/configStore';

const store = configureStore();

// Implementing React Router
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Landing}/>
        <Route path='play' component={Main}/>
        <Route path='gameinfo' component={InfoWrapper}></Route>
        <Route path='signin' component={Login}></Route>
        <Route path='game' component={GameWrapper}></Route>
        <Route path='profile' component={Profile}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);