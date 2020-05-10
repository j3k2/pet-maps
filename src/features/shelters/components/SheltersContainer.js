import React from 'react';
import MapContainer from '../../map/components/MapContainer';
import { Segment, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import SheltersList from './SheltersList';
import { fetchPets } from '../../pets/petsActions';
import { setActiveShelter, resetActiveShelters } from '../shelterActions';
import { setMarkerHighlight } from '../../map/mapActions';

function SheltersContainer(props) {
  return (
    <div style={{
      padding: 20,
    }}>
      <Segment style={{
        background: '#198f35',
        color: 'white',
        padding: 20,
        width: '100%',
        minWidth: 441,
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
        }}>
          <MapContainer/>
        </div>
        <div style={{
          display: 'inline-block',
        }}>
          <SheltersList
            highlightedMarker={props.highlightedMarker}
            scrolledMarker={props.scrolledMarker}
            setMarkerHighlight={props.setMarkerHighlight}
            setActiveShelter={props.setActiveShelter}
            activeShelterIds={props.activeShelterIds}
            shelters={props.shelters}
            loading={props.loading}
            resetActiveShelters={props.resetActiveShelters}
          />
        </div>
        <br />
        <Button
          style={{
            position: 'relative'
          }}
          onClick={() => {
            props.fetchPets(props.activeShelterIds);

          }}>
          Find Pets
                </Button>
      </Segment>
    </div>
  )

}

export default connect(state => {
  return {
    activeShelterIds: state.shelters.activeShelterIds,
    shelters: state.shelters.items,
    loading: state.shelters.loading,
    scrolledMarker: state.shelters.scrolledMarker,
    highlightedMarker: state.map.highlightedMarker
  }
}, {
  fetchPets,
  setActiveShelter,
  resetActiveShelters,
  setMarkerHighlight
})(SheltersContainer);
