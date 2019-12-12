import React from 'react';
import { Label, Modal, Segment, Header, Icon } from 'semantic-ui-react';
import ImageViewer from './ImageViewer';
import { startCase } from 'lodash';

function PetCardModal(props) {
    return (
        <Modal closeIcon style={{ minWidth: 332 }} open={props.modal}
            onClose={() => {
                props.onModalClose();
            }}>
            <Modal.Header>
                <Header>
                    {props.pet.name.$t}
                    <Header.Subheader>
                        {props.pet.animal.$t}
                        {props.pet.breeds.breed.length && (<span>{' ('}
                            {props.pet.breeds.breed.map((breed, idx) => {
                                if (idx === props.pet.breeds.breed.length - 1) {
                                    return `${breed.$t}` || '';
                                } else {
                                    return `${breed.$t || ''}/`;
                                }
                            })}
                            {')'}</span>)}

                    </Header.Subheader>
                    <div style={{ position: 'relative', left: '-.5rem', top: '.5rem' }}>
                        {props.pet.contact.email.$t ? <Label as='a' color="green" href={`mailto:${props.pet.contact.email.$t}?subject=Adopting ${props.pet.name.$t}`} content={props.pet.contact.email.$t} icon='mail' /> : ''}
                        {props.pet.contact.phone.$t ? <Label as='a' color="green" href={`tel:${props.pet.contact.phone.$t}`} content={props.pet.contact.phone.$t} icon='phone' /> : ''}
                    </div>
                </Header>
            </Modal.Header >
            <Modal.Content image scrolling>
                <div>
                    <ImageViewer images={props.pet.media.photos ? props.pet.media.photos.photo : null}></ImageViewer>
                    <Segment style={{ width: 268 }}>
                        <span>
                            <Icon name="marker"></Icon>
                            {props.pet.shelterName.substring(0, 24) + (props.pet.shelterName.length > 24 ? '...' : '')}<br />
                            {props.pet.contact.address1.$t ? <span>{props.pet.contact.address1.$t}<br /></span> : ''}
                            {props.pet.contact.address2.$t ? <span>{props.pet.contact.address2.$t}<br /></span> : ''}
                            {props.pet.contact.city.$t && props.pet.contact.state.$t && props.pet.contact.zip.$t && props.pet.contact.address1.$t ? <span>{`${props.pet.contact.city.$t}, ${props.pet.contact.state.$t} ${props.pet.contact.zip.$t}`}</span> : ''}
                            {props.pet.contact.city.$t && props.pet.contact.state.$t && props.pet.contact.zip.$t && !props.pet.contact.address1.$t ? <span>{` ${props.pet.contact.city.$t}, ${props.pet.contact.state.$t} ${props.pet.contact.zip.$t}`}</span> : ''}
                        </span>
                    </Segment>
                </div>
                <Modal.Description style={{ width: 0, paddingLeft: 20 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <Label>
                            Size
                                <Label.Detail>
                                {props.pet.size.$t}
                            </Label.Detail>
                        </Label>
                        <Label>
                            Age
                                <Label.Detail>
                                {props.pet.age.$t}
                            </Label.Detail>
                        </Label>
                        <Label>
                            Sex
                                <Label.Detail>
                                {props.pet.sex.$t}
                            </Label.Detail>
                        </Label>
                    </div>
                    {props.pet.options.option && props.pet.options.option.length && <div style={{ marginBottom: '1em' }}>
                        {props.pet.options.option.map((option, idx) => {
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
                        {props.pet.description.$t}
                    </p>
                </Modal.Description>
            </Modal.Content>
        </Modal >);
}

export default PetCardModal;