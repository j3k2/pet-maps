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
    <Image width={228} height={228} src={pet.photos ? pet.photos[0] : ''}></Image>
    <Card.Content>
        <Label style={{ fontFamily: 'Oxygen Mono', fontSize: 11, position: 'absolute', top: '210px', left: '241px' }} color='green' ribbon="right">
            {pet.shelterName.substring(0, 24) + (pet.shelterName.length > 24 ? '...' : '')}
        </Label>
        <Card.Header style={{ height: 24, overflow: 'hidden' }}>
          {pet.name}
        </Card.Header>
        <Card.Meta>
          {pet.animal}
          <br />
          <Label size="tiny">
            Size
            <Label.Detail>
              {pet.size}
            </Label.Detail>
          </Label>
          <Label size="tiny">
            Age
            <Label.Detail>
              {pet.age}
            </Label.Detail>
          </Label>
          <Label size="tiny">
            Gender
            <Label.Detail>
              {pet.gender}
            </Label.Detail>
          </Label>
        </Card.Meta>
        {pet.breeds.primary && <Card.Description style={{ height: 60, overflow: 'hidden' }}>
          {pet.description}
        </Card.Description>}
        {!pet.breeds.primary && <Card.Description style={{ height: 100, overflow: 'hidden' }}>
          {pet.description}
        </Card.Description>}

      </Card.Content>
      {pet.breeds.primary &&
        <Card.Content style={{ overflow: 'hidden', height: 32, marginBottom: 10 }} extra>
          {pet.breeds.primary}
          {pet.breeds.secondary ? `/${pet.breeds.secondary}` : null}
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
          onModalClose={() => {
            this.setState({ modal: false });
          }}
        ></PetCardModal>
      </div>
    )
  }
}

export default PetCard;