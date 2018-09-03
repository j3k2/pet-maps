import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchPets, setActiveFilters } from './actions';
import { Card, Label, Icon, Loader, Form, Segment, Dropdown } from 'semantic-ui-react'
import PetCard from './PetCard';

class PetsView extends Component {
    renderPetCards(pets, activeFilters) {
        return _.map(_.reject(pets, (pet) => {
            let rejectPet = false;
            _.each(activeFilters, (activeFilter, fieldName) => {
                if (activeFilter.length > 0 && activeFilters[fieldName].indexOf(pet[fieldName].$t) < 0) {
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
            return (<Label active={shelter.active} as="a" style={{ margin: 4 }} key={idx}>
                <Icon name={shelter.active ? "remove circle" : "add circle"}></Icon>
                {shelter.name.$t}
            </Label>);
        });
    }

    renderFilters(filters) {
        return _.map(filters, (fieldValues, fieldName) => {
            const options = _.map(fieldValues, (value) => {

                return {
                    key: value,
                    text: value,
                    value: value
                }
            });
            return (
                <Form.Field>
                    <label style={{ color: 'white' }}>{fieldName.toUpperCase()}</label>
                    <Dropdown
                        fluid
                        multiple selection
                        placeholder={fieldName.toUpperCase()}
                        key={fieldName}
                        options={options}
                        onChange={(e, d) => {
                            this.props.setActiveFilters(d.value, fieldName);
                        }} />
                </Form.Field>

            )
        });

    }

    renderFiltersMenu(filters) {
        return (
            <Segment style={{
                minWidth: 441,
                background: '#198f35'
            }}>
                <Form>
                    <Form.Group widths="equal" style={{ padding: 20 }}>
                        {this.renderFilters(filters)}
                    </Form.Group>
                </Form>
            </Segment>)
    }

    render() {
        return (
            <div>
                {!this.props.loading.pets && this.props.pets && <div style={{ padding: 20 }}>
                    {this.renderFiltersMenu(this.props.filters)}
                    <Card.Group centered>
                        {this.renderPetCards(this.props.pets, this.props.activeFilters)}

                    </Card.Group>
                </div>}
                {this.props.loading.pets && <Loader active inline='centered'>Loading Pets</Loader>}
            </div>
        )
    }
    componentDidUpdate(prevProps) {
        console.log('cdu', this.props, prevProps);
        if (!_.isEqual(this.props.shelters, prevProps.shelters)) {
            console.log('fetching Pets...');
            if (this.props.shelters && this.props.shelters.length) {
                this.props.fetchPets(this.props.shelters);
            }
        }
    }
}

export default connect(state => {
    return { shelters: state.shelters, pets: state.pets, loading: state.loading, filters: state.filters, activeFilters: state.activeFilters }
}, { fetchPets, setActiveFilters })(PetsView);