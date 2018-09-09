import React, { Component } from 'react';
import { connect } from 'react-redux';

import SheltersList from './SheltersList';
import MapWrapper from './MapWrapper';
import { Icon, Segment, Button } from 'semantic-ui-react';
import { fetchPets } from './actions';

class MapView extends Component {
    constructor(props){
        super(props);
        this.state = {
            init: true,
            highlight: false
        }
    }
    render() {
        return (
            <div style={{
                padding: 20,
            }}>
                <Segment style={{
                    background: '#198f35',
                    color: 'white',
                    padding: 20,
                    width: '100%',
                    minWidth: 441,
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'inline-block',
                    }}>
                        <MapWrapper />
                    </div>
                    <div style={{
                        display: 'inline-block',
                    }}>
                        <SheltersList highlightButton={()=>{
                            if(!this.state.init) {
                                this.setState({highlight: true});
                            }
                        }} />
                    </div>
                    <br />
                    <Button onClick={()=>{
                        this.props.fetchPets(this.props.activeShelters);
                        this.setState({init: false});
                        this.setState({highlight: false});
                    }}>{this.state.highlight ? 'Update Pets' : 'Find Pets'}</Button>
                </Segment>
            </div>
        )
    }
}



export default connect(state => {
    return { activeShelters: state.activeShelters}
}, { fetchPets })(MapView);