import React from 'react';
import { map, reject, each } from 'lodash';
import PetCard from './PetCard';
import { Card } from 'semantic-ui-react';

function PetCardsGroup(props) {
    return (
        <Card.Group centered>
            {renderPetCards(props.pets, props.activePetFilters)}
        </Card.Group>
    );
}

function renderPetCards(pets, activePetFilters) {
    return map(reject(pets, (pet) => {
        let rejectPet = false;
        each(activePetFilters, (activeFilter, fieldName) => {
            if (activeFilter.length > 0 && activePetFilters[fieldName].indexOf(pet[fieldName].$t) < 0) {
                rejectPet = true;
            }
        });
        return rejectPet;
    }), (pet) => {
        if (!pet) {
            return;
        }
        return <PetCard
                key={pet.id.$t}
                pet={pet}></PetCard>
    });
}


export default PetCardsGroup;