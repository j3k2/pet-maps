import React from 'react';
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { connect } from 'react-redux';
import { fetchShelters } from './actions';

const MapComponent = connect(state => {
  return {
    shelters: state.shelters
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
        props.fetchShelters(refs.map.getCenter());
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
    >
    {props.shelters && props.shelters.map((shelter, id)=>{
      return (<Marker
        key={id}
        position={{ lat: parseFloat(shelter.latitude.$t), lng: parseFloat(shelter.longitude.$t)}}
      ></Marker>);
    })}
    </GoogleMap>
    <div>
      {JSON.stringify(props.shelters)}
    </div>
  </div>
  ));

export default MapComponent;