import React from 'react';
import { map, reject, each, isEmpty, startCase } from 'lodash';
import { connect } from 'react-redux';
import { setActivePetFilters } from '../../actions/petActions';
import { Card, Loader, Form, Segment, Dropdown } from 'semantic-ui-react'
import PetCard from './PetCard';

function PetsView(props) {
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

    function renderPetFilters(filters) {
        return map(filters, (fieldValues, fieldName) => {
            const options = map(fieldValues, (value) => {

                return {
                    key: value,
                    text: value,
                    value: value
                }
            });
            return (
                <Form.Field key={fieldName}>
                    <label style={{ color: 'white' }}>{startCase(fieldName)}</label>
                    <Dropdown
                        fluid
                        multiple selection
                        placeholder={startCase(fieldName)}
                        options={options}
                        onChange={(e, d) => {
                            props.setActivePetFilters(d.value, fieldName);
                        }} />
                </Form.Field>

            )
        });

    }

    function renderPetFiltersMenu(petFilters) {
        return (
            <Segment style={{
                minWidth: 441,
                background: '#198f35'
            }}>
                <Form>
                    <Form.Group widths="equal" style={{ padding: 20 }}>
                        {renderPetFilters(petFilters)}
                    </Form.Group>
                </Form>
            </Segment>)
    }

    return (
        <div>
            {!props.loading && !isEmpty(props.petFilters) && <div style={{ padding: 20 }}>
                {renderPetFiltersMenu(props.petFilters)}
                <Card.Group centered>
                    {renderPetCards(props.pets, props.activePetFilters)}

                </Card.Group>
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
}, { setActivePetFilters })(PetsView);