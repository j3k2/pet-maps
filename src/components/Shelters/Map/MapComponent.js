import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { debounce } from 'lodash';
import paw from '../../../assets/pawprint_green.png';

class MapComponent extends React.Component {
  render() {
    return (
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_MAPS_KEY}
      >
        <GoogleMap
          mapContainerStyle={{
            height: 400,
            width: 400
          }}
          zoom={13}
          center={this.props.center}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          }}
          onLoad={(map) => {
            this.map = map;
          }}
          onBoundsChanged={(map) => {
            if (!this.props.update || !this.map.getCenter()) {
              return;
            }
            debounce(() => {
              this.props.onMapUpdate(this.map)
            }, 500)();
          }}>
          {this.props.markers && this.props.markers.length > 0 && this.props.markers.map((marker, idx) => {
            return renderMarker(marker, idx, this.props);
          })}
        </GoogleMap>
      </LoadScript>
    )
  }
}

function renderMarker(marker, idx, props) {
  return (
    <Marker
      key={idx}
      opacity={props.highlightedMarker === marker.markerId ? 1 : 0.4}
      icon={paw}
      position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
      onClick={() => {
        props.onMarkerClick(marker);
      }}
      onMouseOver={() => {
        props.onMarkerMouseOver(marker);
      }}
      onMouseOut={() => {
        props.onMarkerMouseOut(marker);
      }}
    >
    </Marker>);
}

export default MapComponent;