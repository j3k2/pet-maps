import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchPets, setActiveFilters } from './actions';
import { Card, Label, Image, Icon, Loader, Form } from 'semantic-ui-react'

class PetsView extends Component {
    constructor(props) {
        super(props);
    }
    getShelterName(shelterId) {
        const shelter = _.find(this.props.shelters, (shelter) => {
            return shelterId === shelter.id.$t;
        });
        if (shelter) {
            return shelter.name.$t.substring(0, 24) + (shelter.name.$t.length > 24 ? '...' : '');
        }
    }
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
            return (<Card
                style={{ display: 'inline-block', width: 228, margin: 20 }}
                key={pet.id.$t}>
                <Image width={228} height={228} src={pet.media.photos ? pet.media.photos.photo[0].$t : ''}></Image>
                <Card.Content>
                    <Label style={{ fontFamily: 'Oxygen Mono', fontSize: 11, position: 'absolute', top: '210px', left: '241px' }} color='green' ribbon="right">
                        {this.getShelterName(pet.shelterId.$t)}
                    </Label>
                    <Card.Header style={{ height: 24, overflow: 'hidden' }}>
                        {pet.name.$t}
                    </Card.Header>
                    <Card.Meta>
                        {pet.animal.$t}
                        <br />
                        <Label size="tiny">
                            Age
                            <Label.Detail>
                                {pet.age.$t}
                            </Label.Detail>
                        </Label>
                        <Label size="tiny">
                            Sex
                            <Label.Detail>
                                {pet.sex.$t}
                            </Label.Detail>
                        </Label>
                        <Label size="tiny">
                            Size
                            <Label.Detail>
                                {pet.size.$t}
                            </Label.Detail>
                        </Label>
                    </Card.Meta>
                    {pet.breeds.breed.length && <Card.Description style={{ height: 60, overflow: 'hidden' }}>
                        {pet.description.$t}
                    </Card.Description>}
                    {!pet.breeds.breed.length && <Card.Description style={{ height: 100, overflow: 'hidden' }}>
                        {pet.description.$t}
                    </Card.Description>}

                </Card.Content>
                {pet.breeds.breed.length &&
                    <Card.Content style={{ overflow: 'hidden', height: 32, marginBottom: 10 }} extra>
                        {pet.breeds.breed.length && _.map(pet.breeds.breed, (breed, idx) => {
                            if (idx === pet.breeds.breed.length - 1) {
                                return breed.$t || '';
                            } else {
                                return (breed.$t || '') + '/';
                            }
                        })}
                    </Card.Content>}
            </Card>)
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
                    value: value,
                    fieldName: fieldName
                }
            });
            return (
                <Form.Dropdown
                    multiple selection
                    label={fieldName.toUpperCase()}
                    placeholder={fieldName.toUpperCase()}
                    key={fieldName}
                    options={options}
                    onChange={(e, d) => {
                        this.props.setActiveFilters(d.value, fieldName);
                    }} />
            )
        });

    }

    renderFiltersMenu(filters) {
        return (
            <Card fluid>
                <Form>
                    <Form.Group widths="equal" style={{ padding: 20 }}>
                        {this.renderFilters(filters)}
                    </Form.Group>
                </Form>
            </Card>)
    }

    render() {
        return (
            <div>
                {!this.props.loading.pets && this.props.pets && <div style={{ padding: 20 }}>
                    {this.renderFiltersMenu(this.props.filters)}
                    {this.renderPetCards(this.props.pets, this.props.activeFilters)}
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