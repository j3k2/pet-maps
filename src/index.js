import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reducers from './reducers';
import MapWrapper from './MapWrapper';
import PetsView from './PetsView';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Geocode from "react-geocode";
import 'semantic-ui-css/semantic.min.css';
Geocode.setApiKey("AIzaSyC_B0i6MVuX3EntXhXhT4YbLxghaFixQ8c");

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

class App extends Component {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <div>
          <div style={{ position: 'fixed', zIndex: 999, width: '100%', background: 'black', color: 'white' }}>
            PET RADAR
          </div>
          <div>
            <div style={{position: 'fixed', textAlign: 'center'}}>
              <MapWrapper />
            </div>
            <div style={{position: 'relative', left: 400, width: 1024}}>
              <PetsView />
            </div>
          </div>
        </div>

      </Provider>
    )
  }
}

render(<App />
  , document.getElementById('root'));
