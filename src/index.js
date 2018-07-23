import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reducers from './reducers';
import MapWrapper from './MapWrapper';
import PetsView from './PetsView';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyC_B0i6MVuX3EntXhXhT4YbLxghaFixQ8c");

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

class App extends Component {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <div>
          <MapWrapper />
          <PetsView />
        </div>
      </Provider>
    )
  }
}

render(<App />
  , document.getElementById('root'));
