import React from 'react';
import MyMapComponent from './MapComponent';
import { connect } from 'react-redux';


class MapWrapper extends React.PureComponent {
  state = {
    update: true
  }

  handleCheckbox = (e) => {
    this.setState({
      update: e.target.checked
    });
  }

  render() {
    return (
      <div style={{}}>
        {<div>
          Update results as map is updated: <input type="checkbox" checked={this.state.update} onChange={this.handleCheckbox} />
        </div>}
        {<MyMapComponent
          center={this.props.center}
          update={this.state.update}
        />}
      </div>
    )
  }
}

export default connect(state => {
  return { center: state.center }
}, {})(MapWrapper);