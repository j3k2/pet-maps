import React from 'react';
import { Label, Modal, Segment, Header, Icon } from 'semantic-ui-react';
import ImageViewer from './ImageViewer';
import { startCase } from 'lodash';

function PetCardModal({ pet, modal, onModalClose }) {
  return (
    <Modal closeIcon style={{ minWidth: 332 }} open={modal}
      onClose={() => {
        onModalClose();
      }}>
      <Modal.Header>
        <Header>
          {pet.name}
          <Header.Subheader>
            {pet.animal}
            {pet.breeds.primary && (<span>{' ('}
              {pet.breeds.primary}
              {pet.breeds.secondary ? `/${pet.breeds.secondary}` : null}
              {')'}</span>)}

          </Header.Subheader>
          <div style={{ position: 'relative', left: '-.5rem', top: '.5rem' }}>
            {pet.contact.email ? <Label as='a' color="green" href={`mailto:${pet.contact.email}?subject=Adopting ${pet.name}`} content={pet.contact.email} icon='mail' /> : ''}
            {pet.contact.phone ? <Label as='a' color="green" href={`tel:${pet.contact.phone}`} content={pet.contact.phone} icon='phone' /> : ''}
          </div>
        </Header>
      </Modal.Header >
      <Modal.Content image scrolling>
        <div>
          <ImageViewer images={pet.photos ? pet.photos : null}></ImageViewer>
          <Segment style={{ width: 268 }}>
            <span>
              <Icon name="marker"></Icon>
              {pet.shelterName ? pet.shelterName : ''}<br />
              {pet.contact.address.address1 ? <span>{pet.contact.address.address1}<br /></span> : ''}
              {pet.contact.address.address2 ? <span>{pet.contact.address.address2}<br /></span> : ''}
              {pet.contact.address.city && pet.contact.address.state && pet.contact.address.postcode && pet.contact.address.address1 ? <span>{`${pet.contact.address.city}, ${pet.contact.address.state} ${pet.contact.address.postcode}`}</span> : ''}
              {pet.contact.address.city && pet.contact.address.state && pet.contact.address.postcode && !pet.contact.address.address1 ? <span>{` ${pet.contact.address.city}, ${pet.contact.address.state} ${pet.contact.address.postcode}`}</span> : ''}
            </span>
          </Segment>
        </div>
        <Modal.Description style={{ width: 0, paddingLeft: 20 }}>
          <div style={{ marginBottom: '1em' }}>
            <Label>
              Size
              <Label.Detail>
                {pet.size}
              </Label.Detail>
            </Label>
            <Label>
              Age
              <Label.Detail>
                {pet.age}
              </Label.Detail>
            </Label>
            <Label>
              Gender
              <Label.Detail>
                {pet.gender}
              </Label.Detail>
            </Label>
          </div>
          {pet.attributes && <div style={{ marginBottom: '1em' }}>
            {Object.keys(pet.attributes).map((attribute, idx) => {
              if (attribute) {
                return (
                  <Label key={idx} icon="check" style={{ marginBottom: '.3em' }} content={startCase(attribute)} />
                );
              } else {
                return null;
              }
            })}
          </div>}
          <p>
            {pet.description} (<a target="_blank" rel="noopener noreferrer" href={pet.url}>Full profile at petfinder.com</a>)
          </p>
        </Modal.Description>
      </Modal.Content>
    </Modal >);
}

export default PetCardModal;