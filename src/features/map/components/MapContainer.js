import React from 'react';
import MapComponent from './MapComponent';
import { connect } from 'react-redux';
import {
  updateToggled,
  markerHovered,
} from '../mapActions';
import {
  markerSheltersToggled,
  mapUpdated
} from '../../shelters/sheltersActions';
import { Checkbox } from 'semantic-ui-react';

function MapContainer(props) {
  function handleCheckbox(e, data) {
    props.updateToggled(data.checked);
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
          props.mapUpdated({
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng(),
            bounds: { sw: map.getBounds().getSouthWest().toJSON(), ne: map.getBounds().getNorthEast().toJSON() },
            zoom: map.getZoom()
          })
        }}
        onMarkerClick={(marker) => {
          props.markerSheltersToggled(marker.shelterIds);
        //   props.highlightButton();
        }}
        onMarkerMouseOver={(marker) => {
          props.markerHovered(marker.markerId);
        }}
        onMarkerMouseOut={() => {
          props.markerHovered(null);
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
  mapUpdated,
  markerHovered,
  markerSheltersToggled,
  updateToggled
})(MapContainer);