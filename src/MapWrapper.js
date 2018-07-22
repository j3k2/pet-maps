import React from 'react';
import MyMapComponent from './MapComponent';
import Geocode from 'react-geocode';

class MapWrapper extends React.PureComponent {
  state = {
    center: null,
    inputValue: '',
    update: true
  }

  handleButton = () => {
    Geocode.fromAddress(this.state.inputValue).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          center: { lat, lng },
          update: true
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

  handleCheckbox = (e) => {
    this.setState({
      update: e.target.checked
    });
  }

  render() {
    return (
      <div>
        <input type="text" onKeyDown={this.handleKeyDown} onChange={this.handleChange} value={this.state.inputValue} />
        {this.state.center && <div>
          Update results as map is updated: <input type="checkbox" checked={this.state.update} onChange={this.handleCheckbox}/>
          <MyMapComponent
          center={this.state.center}
          update={this.state.update}
        />
        </div>}
      </div>
    )
  }
}

export default MapWrapper;