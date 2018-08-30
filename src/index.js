import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reducers from './reducers';
import PetsView from './PetsView';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Geocode from "react-geocode";
import SearchInput from './SearchInput';
import SlidingPanel from './SlidingPanel';
import { Icon } from 'semantic-ui-react';
import WebFont from 'webfontloader';

import 'semantic-ui-css/semantic.min.css';
Geocode.setApiKey("AIzaSyC_B0i6MVuX3EntXhXhT4YbLxghaFixQ8c");

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

WebFont.load({
  google: {
    families: ['Luckiest Guy:300,400,700', 'sans-serif']
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
          <div style={{ position: 'fixed', height: 70, zIndex: 999, width: '100%', fontSize: 18, background: 'orangered', color: 'white' }}>
            <div style={{ padding: 10, paddingLeft: 20 }}>
              <Icon name="paw" />
              <span style={{ fontFamily: 'Luckiest Guy', marginLeft: 5, marginRight: 30 }}>PET MAPS</span>
              <SearchInput
                showPanel={() => {
                  this.setState({ panelVisible: true });
                }}
              />
              <span
                style={{ float: 'right', paddingTop: 10, paddingRight: 15, cursor: 'pointer' }}
                onClick={() => {
                  this.setState({ panelVisible: !this.state.panelVisible })
                }}>
                {/* <span style={{ marginRight: 10 }}>
                  Toggle Map
                </span> */}
                <Icon name="map"></Icon>
                <Icon name={this.state.panelVisible ? 'toggle on' : 'toggle off'}></Icon>
                </span>
            </div>
            <SlidingPanel visible={this.state.panelVisible} center={this.state.center} />
          </div>
          <div style={{ display: 'inline-block', marginTop: this.state.panelVisible ? 530 : 70, transition: 'all 1s' }}>
            <PetsView />
          </div>
        </div >
      </Provider >
    )
  }
}

render(<App />
  , document.getElementById('root'));
