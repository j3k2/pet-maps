import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/reducers';
import WebFont from 'webfontloader';
import './assets/main.css';
import 'semantic-ui-css/semantic.min.css';
import { Icon, Segment } from 'semantic-ui-react';

import SearchInput from './components/Header/SearchInput';
import MapView from './components/Map/MapView';
import SheltersView from './components/Shelters/SheltersView';
import PetsView from './components/Pets/PetsView';

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
            <div style={{
              padding: 20,
            }}>
              <Segment style={{
                background: '#198f35',
                color: 'white',
                padding: 20,
                width: '100%',
                minWidth: 441,
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-block',
                }}>
                  <MapView
                  // highlightButton={() => {
                  //   if (!this.state.init) {
                  //     this.setState({ highlight: true });
                  //   }
                  // }} 
                  />
                </div>
                <div style={{
                  display: 'inline-block',
                }}>
                  <SheltersView
                  // highlightButton={() => {
                  //   if (!this.state.init) {
                  //     this.setState({ highlight: true });
                  //   }
                  // }} 
                  />
                </div>
                </Segment>
            </div>
            <PetsView />
          </div>
        </div >
      </Provider >
    )
  }
}

render(<App />
  , document.getElementById('root'));
