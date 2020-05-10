import React from 'react';
import MapComponent from './MapComponent';
import { connect } from 'react-redux';
import {
  setUpdateOption,
  setMarkerHighlight,
} from '../mapActions';
import {
  toggleSheltersActive,
  updateShelters,
  setMarkerScroll
} from '../../shelters/shelterActions';
import { Checkbox } from 'semantic-ui-react';

function MapContainer(props) {
  function handleCheckbox(e, data) {
    props.setUpdateOption(data.checked);
  }

  return (
    <div style={{}}>
      {<div>
        Update results as map is updated: <Checkbox checked={props.update} onChange={handleCheckbox} />
      </div>}
      {<MapComponent
        center={props.center}
        update={props.update}
        markers={props.markers}
        highlightedMarker={props.highlightedMarker}

        onMapUpdate={(map) => {
          props.updateShelters({
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng(),
            bounds: { sw: map.getBounds().getSouthWest().toJSON(), ne: map.getBounds().getNorthEast().toJSON() },
            zoom: map.getZoom()
          })
        }}
        onMarkerClick={(marker) => {
          props.toggleSheltersActive(marker.shelterIds);
        //   props.highlightButton();
        }}
        onMarkerMouseOver={(marker) => {
          props.setMarkerScroll(marker.markerId);
          props.setMarkerHighlight(marker.markerId);
        }}
        onMarkerMouseOut={() => {
          props.setMarkerScroll(null);
          props.setMarkerHighlight(null);
        }}
      />}
    </div>
  )
}

export default connect(state => {
  return {
    markers: state.map.markers,
    update: state.map.update,
    center: state.map.center,
    highlightedMarker: state.map.highlightedMarker
  }
}, {
  updateShelters,
  setMarkerHighlight,
  setMarkerScroll,
  toggleSheltersActive,
  setUpdateOption
})(MapContainer);