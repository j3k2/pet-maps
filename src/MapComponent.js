import React from 'react';
import { compose, withProps, withHandlers, withState } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchShelters } from './actions';
import Geocode from 'react-geocode';
import paw from './animal-paw-print.png';

const MapComponent = connect(state => {
  return {
    shelters: state.shelters,
    markers: state.markers,
    update: state.update,
    center: state.center
  }
}, { fetchShelters })(compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC_B0i6MVuX3EntXhXhT4YbLxghaFixQ8c&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, width: '400px', display: 'inline-block'}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withState('zip', 'setZip'),
  withState('zoom', 'setZoom'),
  withHandlers((props) => {
    const refs = {
      map: undefined,
    }

    return {
      onMapMounted: () => ref => {
        refs.map = ref;
      },
      onTilesLoaded: () => () => {
      },
      onMarkerClick: () => () => {
      },
      onCenterChanged: () => () => {
        console.log('occ');

      },
      onZoomChanged: () => () => {
        console.log('ozc');
      },
      onBoundsChanged: ({ zip, setZip, zoom, setZoom }) => (update) => {
        if (!update || !refs.map.getCenter()) {
          return;
        }
        _.debounce(() => {
          Geocode.fromLatLng(refs.map.getCenter().lat(), refs.map.getCenter().lng()).then(
            response => {
              const changedZip = _.find(response.results[0].address_components, (component) => {
                return component.types[0] === "postal_code"
              });
              if (refs.map.getZoom() !== zoom || 
              (changedZip && (!zip || changedZip.long_name !== zip.long_name))) {
                props.fetchShelters(changedZip.long_name, refs.map.getBounds(), refs.map.getZoom());
                setZip(changedZip);
                setZoom(refs.map.getZoom());
              }
            });
        }, 500)();
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <div style={{display: 'inline'}}>
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 37.7432421, lng: -122.497668 }}
      center={props.center}
      ref={props.onMapMounted}
      onTilesLoaded={() => { props.onTilesLoaded(props.update) }}
      onBoundsChanged={() => { props.onBoundsChanged(props.update) }}
      onCenterChanged={() => { props.onCenterChanged(props.update) }}
      onZoomChanged={() => { props.onZoomChanged(props.update) }}
    >
      {props.markers && props.markers.length && props.markers.map((marker, idx) => {
        return (<Marker
          key={idx}
          opacity={0.5}
          icon={paw}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          onClick={() => { props.onMarkerClick(idx) }}
        >
          {/* <InfoBox>
            <div style={{ background: 'yellow', width: 100}}>
            {marker.shelters[0].name.$t}
            </div>
          </InfoBox> */}
        </Marker>);
      })}
    </GoogleMap>
  </div>
));

export default MapComponent;