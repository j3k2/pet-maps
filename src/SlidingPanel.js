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
                height: this.state.visible ? 460 : 20,
                zIndex: 999,
                width: '100%',
                background: 'lightgrey',
                transition: 'all 1s'
            }}>
                <div style={{
                    minWidth: 800,
                    marginTop: 20,
                    transition: 'all 1s'
                }}>
                    <div style={{
                        display: 'inline-block',
                        height: this.state.visible ? 420 : 0,
                        overflowY: 'hidden',
                        position: 'relative',
                        transition: 'all 1s'
                    }}>
                        <MapWrapper />
                    </div>
                    <div style={{
                        display: 'inline-block',
                        height: this.state.visible ? 420 : 0,
                        overflowY: 'hidden',
                        position: 'relative',
                        transition: 'all 1s'
                    }}>
                        <SheltersList />
                    </div>
                </div>

                <a style={{ position: 'absolute', bottom: 0, right: 0 }} onClick={() => {
                    this.props.toggleVisibility();
                }}>{this.state.visible ? 'Hide' : 'Show'}</a>
            </div >
        )
    }

}

export default SlidingPanel;