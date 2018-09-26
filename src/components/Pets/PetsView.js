import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { setActivePetFilters } from '../../actions/actions';
import { Card, Label, Icon, Loader, Form, Segment, Dropdown } from 'semantic-ui-react'
import PetCard from './PetCard';

class PetsView extends Component {
    renderPetCards(pets, activePetFilters) {
        return _.map(_.reject(pets, (pet) => {
            let rejectPet = false;
            _.each(activePetFilters, (activeFilter, fieldName) => {
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
                getShelterName={(shelterId, full) => {
                    const shelter = _.find(this.props.shelters, (shelter) => {
                        return shelterId === shelter.id.$t;
                    });
                    if (shelter && !full) {
                        return shelter.name.$t.substring(0, 24) + (shelter.name.$t.length > 24 ? '...' : '');
                    } else if (shelter && full) {
                        return shelter.name.$t;
                    }
                }}
                key={pet.id.$t}
                pet={pet}></PetCard>

        });
    }

    renderShelterLabels(shelters) {
        return _.map(shelters, (shelter, idx) => {
            return (<Label
                active={shelter.active} as="a" style={{ margin: 4 }} key={idx}>
                <Icon name={shelter.active ? "remove circle" : "add circle"}></Icon>
                {shelter.name.$t}
            </Label>);
        });
    }

    renderPetFilters(filters) {
            return _.map(filters, (fieldValues, fieldName) => {
            const options = _.map(fieldValues, (value) => {

                return {
                    key: value,
                    text: value,
                    value: value
                }
            });
            return (
                <Form.Field key={fieldName}>
                    <label style={{ color: 'white' }}>{_.startCase(fieldName)}</label>
                    <Dropdown
                        fluid
                        multiple selection
                        placeholder={_.startCase(fieldName)}
                        options={options}
                        onChange={(e, d) => {
                            this.props.setActivePetFilters(d.value, fieldName);
                        }} />
                </Form.Field>

            )
        });

    }

    renderPetFiltersMenu(petFilters) {
        return (
            <Segment style={{
                minWidth: 441,
                background: '#198f35'
            }}>
                <Form>
                    <Form.Group widths="equal" style={{ padding: 20 }}>
                        {this.renderPetFilters(petFilters)}
                    </Form.Group>
                </Form>
            </Segment>)
    }

    render() {
        return (
            <div>
                {!this.props.loading && !_.isEmpty(this.props.petFilters) && <div style={{ padding: 20 }}>
                    {this.renderPetFiltersMenu(this.props.petFilters)}
                    <Card.Group centered>
                        {this.renderPetCards(this.props.pets, this.props.activePetFilters)}

                    </Card.Group>
                </div>}
                {this.props.loading && <Loader active inline='centered'>Loading Pets</Loader>}
            </div>
        )
    }
}

export default connect(state => {
    return { shelters: state.shelters.items, 
        pets: state.pets.items, 
        loading: state.pets.loading, 
        petFilters: state.pets.petFilters, 
        activePetFilters: state.pets.activePetFilters }
}, { setActivePetFilters })(PetsView);