import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/reducers';
import WebFont from 'webfontloader';
import './assets/main.css';
import 'semantic-ui-css/semantic.min.css';

import Header from './components/Header/Header';
import SheltersFinder from './components/Shelters/SheltersContainer';
import PetsContainer from './components/Pets/PetsContainer';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

WebFont.load({
  google: {
    families: ['Luckiest Guy:400', 'Oxygen Mono:400']
  }
});

class App extends React.Component {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <div>
          <Header />
          <div style={{
            display: 'inline-block',
            marginTop: 70,
            width: '100%'
          }}>
            <SheltersFinder />
            <PetsContainer />
          </div>
        </div >
      </Provider >
    )
  }
}

render(<App />
  , document.getElementById('root'));
