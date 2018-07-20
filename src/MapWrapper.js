import React from 'react';
import MyMapComponent from './MapComponent';
import Geocode from 'react-geocode';

class MapWrapper extends React.PureComponent {
  state = {
    center: { lat: 37.7432421, lng: -122.497668 },
    inputValue: ''
  }

  handleButton = () => {
    Geocode.fromAddress(this.state.inputValue).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          center: { lat, lng }
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  handleChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleButton();
    }
  }

  render() {
    return (
      <div>
        <input type="text" onKeyDown={this.handleKeyDown} onChange={this.handleChange} value={this.state.inputValue} />
        <MyMapComponent
          center={this.state.center}
        />
      </div>
    )
  }
}

export default MapWrapper;