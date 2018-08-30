import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Icon, List } from 'semantic-ui-react'

class SheltersList extends Component {
    constructor(props) {
        super(props);
    }
    renderShelters(shelters) {
        return _.map(shelters, (shelter, idx) => {
            return (
                <List.Item key={idx} style={{ textAlign: 'left' }}>
                    {`${idx+1}. ${shelter.name.$t}`}<Icon style={{float: 'right', marginLeft: 10}} name={shelter.active ? "remove circle" : "add circle"}></Icon>
                </List.Item>);
        });
    }

    render() {
        return (
            <div>
                {!this.props.loading.shelters && this.props.shelters && <List
                    selection
                    style={{ overflowY: 'scroll', padding: 20, height: '400px' }}>
                    {this.renderShelters(this.props.shelters)}
                </List>}
                {this.props.loading.shelters && 'Loading'}
            </div>
        )
    }
}

export default connect(state => {
    return { shelters: state.shelters, loading: state.loading}
}, {})(SheltersList);