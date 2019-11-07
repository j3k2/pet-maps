import React from 'react';
import { connect } from 'react-redux';
import SheltersList from './SheltersList';
import { fetchPets } from '../../actions/petActions';
import { setActiveShelter, resetActiveShelters } from '../../actions/shelterActions';
import { setMarkerHighlight } from '../../actions/mapActions';
import { Button } from 'semantic-ui-react';

function SheltersView(props) {
    return (
        <div>
            <SheltersList
                {...props}
            />
            <Button style={{
                position: 'relative',
                top: -22,
            }}
                onClick={() => {
                    props.fetchPets(props.activeShelterIds);
                    //   this.props.fetchPets(this.props.activeShelterIds);
                    //   this.setState({ init: false });
                    //   this.setState({ highlight: false });
                }}>
                Find Pets
                {/* {this.state.highlight ? 'Update Pets' : 'Find Pets'} */}
            </Button>
        </div >
    )
}

export default connect(state => {
    return {
        activeShelterIds: state.shelters.activeShelterIds,
        shelters: state.shelters.items,
        loading: state.shelters.loading,
        highlightedMarker: state.markers.highlightedMarker,
        scrolledMarker: state.markers.scrolledMarker
    }
}, {
    fetchPets,
    setActiveShelter, 
    resetActiveShelters, 
    setMarkerHighlight
})(SheltersView);
