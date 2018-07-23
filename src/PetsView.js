import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchPets } from './actions';

class PetsView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {JSON.stringify(this.props.pets)}
            </div>
        )
    }
    componentDidUpdate(prevProps) {
        console.log('cdu');
        if (this.props.shelters && !_.isEqual(this.props.shelters, prevProps.shelters)) {
            this.props.fetchPets(this.props.shelters);
        }
    }
}

export default connect(state => {
    return { shelters: state.shelters, pets: state.pets }
}, { fetchPets })(PetsView);