import React from 'react';
import MapContainer from '../../map/components/MapContainer';
import { Segment, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import SheltersList from './SheltersList';
import { petsRequested } from '../../pets/petsActions';
import { shelterSelectionToggled, allSheltersToggled, shelterListItemHovered } from '../shelterActions';

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
            shelterListItemHovered={props.shelterListItemHovered}
            shelterSelectionToggled={props.shelterSelectionToggled}
            activeShelterIds={props.activeShelterIds}
            shelters={props.shelters}
            loading={props.loading}
            allSheltersToggled={props.allSheltersToggled}
          />
        </div>
        <br />
        <Button
          style={{
            position: 'relative'
          }}
          onClick={() => {
            props.petsRequested(props.activeShelterIds);
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
  petsRequested,
  shelterSelectionToggled,
  allSheltersToggled,
  shelterListItemHovered
})(SheltersContainer);
