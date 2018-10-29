import React from 'react';
import MyMapComponent from './MapComponent';
import { connect } from 'react-redux';
import { setUpdateOption } from '../../actions/mapActions';
import { Checkbox } from 'semantic-ui-react';

function MapWrapper(props){
  function handleCheckbox(e, data) {
    props.setUpdateOption(data.checked);
  }

    return (
      <div style={{}}>
        {<div>
          Update results as map is updated: <Checkbox checked={props.update} onChange={handleCheckbox} />
        </div>}
        {<MyMapComponent {...props} />}
      </div>
    )
}

export default connect(state => {
  return { update: state.map.update}
}, { setUpdateOption })(MapWrapper);