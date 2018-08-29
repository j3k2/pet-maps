import React, { Component } from 'react';
import SheltersList from './SheltersList';
import MapWrapper from './MapWrapper';

class SlidingPanel extends Component {
    state = {
        visible: this.props.visible
    }

    componentDidUpdate(prevProps) {
        if(prevProps.visible !== this.props.visible) {
            this.setState({visible: this.props.visible});
        }
    }

    render() {
        return (
            <div style={{
                textAlign: 'center',
                position: 'fixed',
                height: this.state.visible ? 460 : 0,
                zIndex: 999,
                width: '100%',
                background: 'lightgrey',
                color: 'black',
                transition: 'all 0.4s'
            }}>
                <div style={{
                    minWidth: 800,
                    marginTop: 20,
                    transition: 'all 0.4s'
                }}>
                    <div style={{
                        display: 'inline-block',
                        height: this.state.visible ? 420 : 0,
                        overflowY: 'hidden',
                        position: 'relative',
                        transition: 'all 0.4s'
                    }}>
                        <MapWrapper />
                    </div>
                    <div style={{
                        display: 'inline-block',
                        height: this.state.visible ? 420 : 0,
                        overflowY: 'hidden',
                        position: 'relative',
                        transition: 'all 0.4s'
                    }}>
                        <SheltersList />
                    </div>
                </div>
            </div >
        )
    }

}

export default SlidingPanel;