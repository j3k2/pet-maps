import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reducers from './reducers';
import PetsView from './PetsView';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Geocode from "react-geocode";
import paw from './animal-paw-print.png';
import SearchInput from './SearchInput';
import SlidingPanel from './SlidingPanel';

import 'semantic-ui-css/semantic.min.css';
Geocode.setApiKey("AIzaSyC_B0i6MVuX3EntXhXhT4YbLxghaFixQ8c");

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

class App extends Component {
  state = {
    panelVisible: true
  }
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <div>
          <div style={{ position: 'fixed', height: 70, zIndex: 999, width: '100%', fontSize: 18, background: 'maroon', color: 'white' }}>
            <div style={{ padding: 10 }}>
              <img src={paw} />
              <span style={{ marginLeft: 10, marginRight: 10 }}>PET RADAR</span>
              <SearchInput />
            </div>

            <SlidingPanel visible={this.state.panelVisible} toggleVisibility={() => {
              this.setState({ panelVisible: !this.state.panelVisible })
            }} />
          </div>
          <div style={{ display: 'inline-block', marginTop: this.state.panelVisible ? 480 : 70, transition: 'all 1s' }}>
            <PetsView />

          </div>
        </div >
      </Provider >
    )
  }
}

render(<App />
  , document.getElementById('root'));
