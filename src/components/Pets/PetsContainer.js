import React from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { setActivePetFilters } from '../../actions/petActions';
import { Loader, Segment } from 'semantic-ui-react'
import PetCardsGroup from './PetCardsGroup';
import PetFiltersMenu from './PetFiltersMenu';

function PetsContainer(props) {
    return (
        <div>
            {!props.loading && !isEmpty(props.petFilters) && <div style={{ padding: 20 }}>
                <PetFiltersMenu petFilters={props.petFilters}  setActivePetFilters={props.setActivePetFilters} />
                <PetCardsGroup pets={props.pets} activePetFilters={props.activePetFilters}/>
            </div>}
            {props.loading && <Loader active inline='centered'>Loading Pets</Loader>}
            {!props.loading && props.pets && props.pets.length === 0 &&
                <Segment>No pets found for the selected shelters.</Segment>
            }
        </div>
    )
}

export default connect(state => {
    return {
        shelters: state.shelters.items,
        pets: state.pets.items,
        loading: state.pets.loading,
        petFilters: state.pets.petFilters,
        activePetFilters: state.pets.activePetFilters
    }
}, { setActivePetFilters })(PetsContainer);