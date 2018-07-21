import React from 'react';
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchShelters } from './actions';
import Geocode from 'react-geocode';

const MapComponent = connect(state => {
  return {
    shelters: state.shelters,
    markers: state.markers
  }
}, { fetchShelters })(compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC_B0i6MVuX3EntXhXhT4YbLxghaFixQ8c&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers((props) => {
    const refs = {
      map: undefined,
    }

    return {
      onMapMounted: () => ref => {
        refs.map = ref
      },
      onTilesLoaded: () => () => {
        console.log('otc');
      },
      onMarkerClick: () => (idx) => {
        console.log(idx);
        //action to update shelters in redux state -> which will update shelters in component props
      },
      onCenterChanged: () => () => {

      },
      onBoundsChanged: () => () => {
        _.debounce(()=>{
          Geocode.fromLatLng(refs.map.getCenter().lat(), refs.map.getCenter().lng()).then(
            response => {
              const zip = _.find(response.results[0].address_components, (component) => {
                return component.types[0] === "postal_code"
              });
              if(zip) {
                props.fetchShelters(zip.long_name, refs.map.getBounds());
              }
            });
        }, 500)();
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <div>
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 37.7432421, lng: -122.497668 }}
      center={props.center}
      ref={props.onMapMounted}
      onTilesLoaded={props.onTilesLoaded}
      onBoundsChanged={props.onBoundsChanged}
      onCenterChanged={props.onCenterChanged}
    >
      {props.markers && props.markers.length && props.markers.map((marker, idx) => {
        return (<Marker
          key={idx}
          style={{background: 'pink'}}
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
    <div>
      {JSON.stringify(props)}
    </div>
  </div>
));

export default MapComponent;