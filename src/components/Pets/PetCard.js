import React, { Component } from 'react';
import { Image, Card, Label, Modal, Segment, Header, Icon } from 'semantic-ui-react';
import { map, startCase } from 'lodash';
import ImageViewer from './ImageViewer';

class PetCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            modal: false
        }
    }
    
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
                    {pet.shelterName}
                </Label>
                <Card.Header style={{ height: 24, overflow: 'hidden' }}>
                    {pet.name.$t}
                </Card.Header>
                <Card.Meta>
                    {pet.animal.$t}
                    <br />
                    <Label size="tiny">
                        Size
                        <Label.Detail>
                            {pet.size.$t}
                        </Label.Detail>
                    </Label>
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
                    {pet.breeds.breed.length && map(pet.breeds.breed, (breed, idx) => {
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
            <Modal style={{ minWidth: 332 }} open={this.state.modal}
                onClose={() => {
                    this.setState({ modal: false })
                }}>
                <Modal.Header>
                    <Header>
                        {pet.name.$t}
                        <Header.Subheader>
                            {pet.animal.$t}
                            {pet.breeds.breed.length && (<span>{' ('}
                                {map(pet.breeds.breed, (breed, idx) => {
                                    if (idx === pet.breeds.breed.length - 1) {
                                        return `${breed.$t}` || '';
                                    } else {
                                        return `${breed.$t || ''}/`;
                                    }
                                })}
                                {')'}</span>)}

                        </Header.Subheader>
                        <div style={{ position: 'relative', left: '-.5rem', top: '.5rem' }}>
                            {pet.contact.email.$t ? <Label as='a' color="green" href={`mailto:${pet.contact.email.$t}?subject=Adopting ${pet.name.$t}`} content={pet.contact.email.$t} icon='mail' /> : ''}
                            {pet.contact.phone.$t ? <Label as='a' color="green" href={`tel:${pet.contact.phone.$t}`} content={pet.contact.phone.$t} icon='phone' /> : ''}
                        </div>
                    </Header>
                </Modal.Header >
                <Modal.Content image scrolling>
                    <div>
                        <ImageViewer images={pet.media.photos ? pet.media.photos.photo : null}></ImageViewer>
                        <Segment style={{ width: 268 }}>
                            <span>
                                <Icon name="marker"></Icon>
                                {pet.shelterName.substring(0, 24) + (pet.shelterName.length > 24 ? '...' : '')}<br />
                                {pet.contact.address1.$t ? <span>{pet.contact.address1.$t}<br /></span> : ''}
                                {pet.contact.address2.$t ? <span>{pet.contact.address2.$t}<br /></span> : ''}
                                {pet.contact.city.$t && pet.contact.state.$t && pet.contact.zip.$t && pet.contact.address1.$t ? <span>{`${pet.contact.city.$t}, ${pet.contact.state.$t} ${pet.contact.zip.$t}`}</span> : ''}
                                {pet.contact.city.$t && pet.contact.state.$t && pet.contact.zip.$t && !pet.contact.address1.$t ? <span>{` ${pet.contact.city.$t}, ${pet.contact.state.$t} ${pet.contact.zip.$t}`}</span> : ''}
                            </span>
                        </Segment>
                    </div>
                    <Modal.Description style={{ width: 0, paddingLeft: 20 }}>
                        <div style={{ marginBottom: '1em' }}>
                            <Label>
                                Size
                                <Label.Detail>
                                    {pet.size.$t}
                                </Label.Detail>
                            </Label>
                            <Label>
                                Age
                                <Label.Detail>
                                    {pet.age.$t}
                                </Label.Detail>
                            </Label>
                            <Label>
                                Sex
                                <Label.Detail>
                                    {pet.sex.$t}
                                </Label.Detail>
                            </Label>
                        </div>
                        {pet.options.option && pet.options.option.length && <div style={{ marginBottom: '1em' }}>
                            {map(pet.options.option, (option, idx) => {
                                if (option.$t) {
                                    return (
                                        <Label key={idx} icon="check" style={{ marginBottom: '.3em' }} content={startCase(option.$t)} />
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </div>}
                        <p>
                            {pet.description.$t}
                        </p>
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