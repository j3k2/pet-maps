import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reducers from './reducers/reducers';
import PetsView from './components/Pets/PetsView';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Geocode from "react-geocode";
import SearchInput from './components/Header/SearchInput';
import MapView from './components/Map/MapView';
import { Icon, Segment, Button } from 'semantic-ui-react';
import WebFont from 'webfontloader';
import './assets/main.css';

import 'semantic-ui-css/semantic.min.css';
Geocode.setApiKey("AIzaSyC_B0i6MVuX3EntXhXhT4YbLxghaFixQ8c");

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

WebFont.load({
  google: {
    families: ['Luckiest Guy:400', 'Oxygen Mono:400']
  }
});

class App extends Component {
  state = {
    panelVisible: false
  }
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <div>
          <div style={{
            position: 'fixed',
            height: 70,
            zIndex: 999,
            width: '100%',
            minWidth: 840,
            fontSize: 18,
            background: '#198f35',
            color: 'white'
          }}>
            <div style={{ padding: 10, paddingLeft: 20 }}>
              <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                <Icon name="paw" />
                <span style={{ fontFamily: 'Luckiest Guy', marginLeft: 5, marginRight: 30 }}>PET MAPS</span>
              </div>
              <SearchInput />
            </div>
          </div>
          <div style={{
            display: 'inline-block',
            marginTop: 70,
            width: '100%'
          }}>
          <MapView></MapView>
            <PetsView />
          </div>
        </div >
      </Provider >
    )
  }
}

render(<App />
  , document.getElementById('root'));
