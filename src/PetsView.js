import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchPets } from './actions';
import { Card, Label, Image, Icon, Loader } from 'semantic-ui-react'

class PetsView extends Component {
    constructor(props) {
        super(props);
    }
    getShelterName(shelterId) {
        const shelter = _.find(this.props.shelters, (shelter) => {
            return shelterId === shelter.id.$t;
        });
        if (shelter) {
            return shelter.name.$t.substring(0, 32);
        }
    }
    renderPetCards(pets) {
        return _.map(pets, (pet) => {
            if (!pet) {
                return;
            }
            return (<Card
                style={{ display: 'inline-block', width: 228, margin: 10 }}
                key={pet.id.$t}>
                <Image width={228} height={228} src={pet.media.photos ? pet.media.photos.photo[0].$t : ''}></Image>
                <Card.Content>
                    <Label style={{ position: 'relative', top: '-8px' }} color='orange' ribbon>
                        {this.getShelterName(pet.shelterId.$t)}
                    </Label>
                    <Card.Header style={{ height: 24, overflow: 'hidden' }}>
                        {pet.name.$t}
                    </Card.Header>
                    <Card.Meta>
                        Sex: {pet.sex.$t} Size: {pet.size.$t}<br />
                        {pet.age.$t} {pet.animal.$t}<br />

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

    render() {
        return (
            <div>
                {!this.props.loading.pets && this.props.pets && <div style={{ padding: 20 }}>
                    {/* {this.renderShelterLabels(this.props.shelters)} */}
                    <br />
                    {this.renderPetCards(this.props.pets)}
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
    return { shelters: state.shelters, shelters: state.shelters, pets: state.pets, loading: state.loading }
}, { fetchPets })(PetsView);