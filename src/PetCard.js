import React, {Component} from 'react';
import {Image, Card, Label} from 'semantic-ui-react';
import _ from 'lodash';

class PetCard extends Component {
    render() {
        return (<Card
            style={{
                cursor: 'pointer',
                display: 'inline-block',
                width: 228,
                marginTop: 40,
                marginRight: 20,
                marginLeft: 20
            }}>
            <Image width={228} height={228} src={this.props.pet.media.photos ? this.props.pet.media.photos.photo[0].$t : ''}></Image>
            <Card.Content>
                <Label style={{ fontFamily: 'Oxygen Mono', fontSize: 11, position: 'absolute', top: '210px', left: '241px' }} color='green' ribbon="right">
                    {this.props.getShelterName(this.props.pet.shelterId.$t)}
                </Label>
                <Card.Header style={{ height: 24, overflow: 'hidden' }}>
                    {this.props.pet.name.$t}
                </Card.Header>
                <Card.Meta>
                    {this.props.pet.animal.$t}
                    <br />
                    <Label size="tiny">
                        Age
                <Label.Detail>
                            {this.props.pet.age.$t}
                        </Label.Detail>
                    </Label>
                    <Label size="tiny">
                        Sex
                <Label.Detail>
                            {this.props.pet.sex.$t}
                        </Label.Detail>
                    </Label>
                    <Label size="tiny">
                        Size
                <Label.Detail>
                            {this.props.pet.size.$t}
                        </Label.Detail>
                    </Label>
                </Card.Meta>
                {this.props.pet.breeds.breed.length && <Card.Description style={{ height: 60, overflow: 'hidden' }}>
                    {this.props.pet.description.$t}
                </Card.Description>}
                {!this.props.pet.breeds.breed.length && <Card.Description style={{ height: 100, overflow: 'hidden' }}>
                    {this.props.pet.description.$t}
                </Card.Description>}

            </Card.Content>
            {this.props.pet.breeds.breed.length &&
                <Card.Content style={{ overflow: 'hidden', height: 32, marginBottom: 10 }} extra>
                    {this.props.pet.breeds.breed.length && _.map(this.props.pet.breeds.breed, (breed, idx) => {
                        if (idx === this.props.pet.breeds.breed.length - 1) {
                            return breed.$t || '';
                        } else {
                            return (breed.$t || '') + '/';
                        }
                    })}
                </Card.Content>}
        </Card>)
    }
}

export default PetCard;