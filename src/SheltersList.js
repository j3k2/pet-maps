import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react'

class SheltersList extends Component {
    constructor(props) {
        super(props);
    }
    renderShelters(shelters) {
        return _.map(shelters, (shelter, idx) => {
            return (
                <div role='listitem' className='item' key={idx} style={{ textAlign: 'left' }}>
                    {shelter.name.$t}<Icon style={{float: 'right', marginLeft: 10}} name={shelter.active ? "remove circle" : "add circle"}></Icon>
                </div>);
        });
    }

    render() {
        return (
            <div>
                {this.props.shelters && <div
                    role='list'
                    className='ui divided relaxed ordered list'
                    style={{ overflowY: 'scroll', padding: 20, height: '400px' }}>
                    {this.renderShelters(this.props.shelters)}
                </div>}
            </div>
        )
    }
}

export default connect(state => {
    return { shelters: state.shelters }
}, {})(SheltersList);