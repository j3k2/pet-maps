import React, { Component } from 'react';
import MyMapComponent from './MapComponent';
import { connect } from 'react-redux';
import { setUpdateOption } from '../../actions/actions';
import { Checkbox } from 'semantic-ui-react';

class MapWrapper extends Component {
  handleCheckbox = (e, data) => {
    this.props.setUpdateOption(data.checked);
  }

  render() {
    return (
      <div style={{}}>
        {<div>
          Update results as map is updated: <Checkbox checked={this.props.update} onChange={this.handleCheckbox} />
        </div>}
        {<MyMapComponent {...this.props} />}
      </div>
    )
  }
}

export default connect(state => {
  return { update: state.update}
}, { setUpdateOption })(MapWrapper);