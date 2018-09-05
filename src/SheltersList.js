import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Icon, List, Loader, Checkbox, Label } from 'semantic-ui-react';
import { setShelterFilter } from './actions';

class SheltersList extends Component {
    renderShelters(shelters, pets, shelterFilters) {
        console.log('RS', shelterFilters);
        return _.map(shelters, (shelter, idx) => {
            console.log('RS2', shelter.id.$t, typeof shelter.id.$t, this.props.shelterFilters.indexOf(shelter.id.$t), this.props.shelterFilters.indexOf(shelter.id.$t) < 0);
            return (
                <List.Item key={idx} style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                    <List.Content>
                        <List.Header>
                            {`${idx + 1}. ${shelter.name.$t}`}
                            <Checkbox checked={this.props.shelterFilters.indexOf(shelter.id.$t) < 0} onChange={(e, d) => {
                                this.props.setShelterFilter(shelter.id.$t, d.checked);
                            }} style={{ float: 'right', marginLeft: 10 }}></Checkbox>
                        </List.Header>
                        <List.Description>
                            {!this.props.loading.pets && pets && <div>
                                {_.map(_.countBy(pets[shelter.id.$t], 'animal.$t'), (value, key) => {
                                    return (
                                        <Label size="mini">
                                            {key}
                                            <Label.Detail>{value}</Label.Detail>
                                        </Label>
                                    )
                                })}
                            </div>}
                            {this.props.loading.pets && <Loader active size="mini" inline="left"></Loader>}
                        </List.Description>

                    </List.Content>
                    {/* <Icon style={{ float: 'right', marginLeft: 10 }} name={shelter.active ? "remove circle" : "add circle"}></Icon> */}
                </List.Item>);
        });
    }

    render() {
        return (
            <div
                style={{
                    overflowY: 'scroll',
                    padding: 20,
                    marginLeft: 0,
                    height: '400px',
                    // width: 454, 
                    width: 400,
                    background: 'white'
                }}>
                {!this.props.loading.shelters && this.props.shelters && <List
                    style={{ color: 'black' }}
                    selection
                    relaxed>
                    {/* {this.props.shelterFilters.length > 0 && <a style={{ float: 'right' }}><span>Select all</span></a>} */}
                    {/* <br /> */}
                    {this.renderShelters(this.props.shelters, this.props.petsByShelter, this.props.shelterFilters)}
                </List>}
                {this.props.loading.shelters && <Loader active inline='centered'>Loading Shelters</Loader>}
            </div>
        )
    }
}

export default connect(state => {
    return { shelters: state.shelters, loading: state.loading, petsByShelter: state.petsByShelter, shelterFilters: state.shelterFilters }
}, { setShelterFilter })(SheltersList);