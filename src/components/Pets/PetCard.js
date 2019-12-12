import React, { Component } from 'react';
import { Image, Card, Label } from 'semantic-ui-react';

import PetCardModal from './PetCardModal';

class PetCard extends Component {
    state = {
        modal: false
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
                    {pet.shelterName.substring(0, 24) + (pet.shelterName.length > 24 ? '...' : '')}
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
                    {pet.breeds.breed.length && pet.breeds.breed.map((breed, idx) => {
                        if (idx === pet.breeds.breed.length - 1) {
                            return breed.$t || '';
                        } else {
                            return (breed.$t || '') + '/';
                        }
                    })}
                </Card.Content>}
        </Card>)
    }

    render() {
        return (
            <div>
                {this.renderPetCardBody(this.props.pet)}
                <PetCardModal
                    pet={this.props.pet}
                    modal={this.state.modal}
                    onModalClose={()=>{
                        this.setState({ modal: false });
                    }}
                ></PetCardModal>
            </div>
        )
    }
}

export default PetCard;