import React, { Component } from 'react';
import { Image, Card, Label, Modal, Segment, Header } from 'semantic-ui-react';
import _ from 'lodash';

class PetCard extends Component {
    state = {
        modal: false
    };

    renderPetCardBody = (pet) => {
        return (<Card
            style={{
                cursor: 'pointer',
                display: 'inline-block',
                width: 228,
                marginTop: 40,
                marginRight: 20,
                marginLeft: 20
            }}
            onClick={() => {
                this.setState({ modal: true });
            }}>
            <Image width={228} height={228} src={pet.media.photos ? pet.media.photos.photo[0].$t : ''}></Image>
            <Card.Content>
                <Label style={{ fontFamily: 'Oxygen Mono', fontSize: 11, position: 'absolute', top: '210px', left: '241px' }} color='green' ribbon="right">
                    {this.props.getShelterName(pet.shelterId.$t)}
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
    }

    renderPetCardModal = (pet) => {
        return (
            <Modal open={this.state.modal}
                onClose={() => {
                    this.setState({ modal: false })
                }}>
                <Modal.Header>
                    <Header>
                        {pet.name.$t}
                        <Header.Subheader>
                            {pet.animal.$t}
                            {pet.breeds.breed.length && (<span>{' ('}
                                {_.map(pet.breeds.breed, (breed, idx) => {
                                    if (idx === pet.breeds.breed.length - 1) {
                                        return `${breed.$t}` || '';
                                    } else {
                                        return `${breed.$t || ''}/`;
                                    }
                                })}
                                {')'}</span>)}
                        </Header.Subheader>
                        <Header.Subheader style={{position: 'relative', left: '-.5rem', top: '.5rem'}}>
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
                        </Header.Subheader>
                    </Header>
                </Modal.Header >
                <Modal.Content image scrolling>
                    <div>
                        <Image width={228} height={228} src={pet.media.photos ? pet.media.photos.photo[0].$t : ''}></Image><br />
                        <Segment style={{ margin: 20 }}>asdf</Segment>
                    </div>
                    <Modal.Description style={{ width: 0, padding: 20 }}>
                        {pet.description.$t}
                    </Modal.Description>
                </Modal.Content>
            </Modal >);
    }

    render() {
        return (
            <div>
                {this.renderPetCardBody(this.props.pet)}
                {this.renderPetCardModal(this.props.pet)}
            </div>
        )
    }
}

export default PetCard;