import React from 'react';
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import {
  toggleSheltersActive,
  updateShelters
} from '../../actions/shelterActions';
import {
  setMarkerHighlight,
  setMarkerScroll
} from '../../actions/mapActions';
import paw from '../../assets/pawprint_green.png';

const MapComponent = connect(state => {
  return {
    markers: state.markers.items,
    update: state.map.update,
    center: state.map.center,
    highlightedMarker: state.markers.highlightedMarker
  }
}, {
  updateShelters,
  setMarkerHighlight,
  setMarkerScroll,
  toggleSheltersActive
})(compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, width: '400px', display: 'inline-block' }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers((props) => {
    const refs = {
      map: undefined,
    }

    return {
      onMapMounted: () => ref => {
        refs.map = ref;
      },
      onBoundsChanged: () => (update) => {
        if (!update || !refs.map.getCenter()) {
          return;
        }
        debounce(() => {
          props.updateShelters({
            lat: refs.map.getCenter().lat(),
            lng: refs.map.getCenter().lng(),
            bounds: { sw: refs.map.getBounds().getSouthWest().toJSON(), ne: refs.map.getBounds().getNorthEast().toJSON() },
            zoom: refs.map.getZoom()
          })
        }, 500)();
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <div style={{ display: 'inline' }}>
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 37.7432421, lng: -122.497668 }}
      center={props.center}
      ref={props.onMapMounted}
      options={{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }}
      onBoundsChanged={() => { props.onBoundsChanged(props.update) }}
    >
      {props.markers && props.markers.length > 0 && props.markers.map((marker, idx) => {
        return (<Marker
          key={idx}
          opacity={props.highlightedMarker === marker.markerId ? 1 : 0.4}
          icon={paw}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          onClick={() => {
            props.toggleSheltersActive(marker.shelterIds);
            props.highlightButton();
          }}
          onMouseOver={() => {
            props.setMarkerScroll(marker.markerId);
            props.setMarkerHighlight(marker.markerId)
          }}
          onMouseOut={() => {
            props.setMarkerScroll(null);
            props.setMarkerHighlight(null)
          }}
        >
        </Marker>);
      })}
    </GoogleMap>
  </div>
));

export default MapComponent;