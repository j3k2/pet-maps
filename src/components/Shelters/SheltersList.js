import React, { Component } from 'react';
import { min } from 'lodash';
import { Ref, List, Loader, Checkbox } from 'semantic-ui-react';

class SheltersList extends Component {
    listRefs = {};

    renderShelters(shelters) {
        return shelters.map((shelter, idx) => {
            return (
                <Ref
                    key={idx}
                    innerRef={(el) => {
                        this.listRefs[shelter.markerId] = this.listRefs[shelter.markerId] || [];
                        this.listRefs[shelter.markerId].push(el);
                    }}>
                    <List.Item
                        style={{
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            borderRadius: 0,
                            borderLeft: this.props.highlightedMarker === shelter.markerId ? 'solid 4px #198f35' : 'none'
                        }}
                        onMouseEnter={() => {
                            this.props.setMarkerHighlight(shelter.markerId);
                        }}
                        onMouseLeave={() => {
                            this.props.setMarkerHighlight(null);
                        }}
                        onClick={() => {
                            this.props.setActiveShelter(shelter.id, this.props.activeShelterIds.indexOf(shelter.id) > -1);
                        }}
                    >
                        <List.Content>
                            <List.Header>
                                {`${idx + 1}. ${shelter.name}`}
                                <Checkbox checked={this.props.activeShelterIds.indexOf(shelter.id) > -1}
                                    style={{ float: 'right', marginLeft: 10 }}></Checkbox>
                            </List.Header>
                            <List.Description>
                                {shelter.address.address1  ? `${shelter.address.address1} (${shelter.address.postcode})` : shelter.address.postcode}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                </Ref>);
        });
    }

    // componentDidUpdate() {
    //   if (this.props.scrolledMarker && this.listRefs.hasOwnProperty(this.props.scrolledMarker)) {
    //       const refs = this.listRefs[this.props.scrolledMarker];
    //       const offsets = refs.map(ref => {
    //           return ref.offsetTop;
    //       });
    //         this.containerRef.scrollTop =
    //             min(offsets) -
    //             this.containerRef.offsetTop -
    //             parseInt(this.containerRef.style.paddingTop, 10) -
    //             parseInt(this.containerRef.style.paddingBottom, 10);
    //     }
    //     if (!this.props.shelters || !this.props.shelters.length) {
    //         // reset listRefs when shelters are refetched
    //         this.listRefs = {};
    //     }
    // }

    render() {
        return (
            <div
                ref={(el) => {
                    this.containerRef = el;
                }}
                style={{
                    overflowY: 'scroll',
                    padding: 20,
                    marginLeft: 0,
                    height: '400px',
                    width: 400,
                    background: 'white'
                }}>
                {!this.props.loading && this.props.shelters && <List
                    style={{ color: 'black' }}
                    selection
                    relaxed>
                    <span style={{ float: 'left' }}>
                        {`${this.props.shelters.length} results`}
                    </span>
                    <span onClick={() => {
                        this.props.resetActiveShelters(this.props.shelters.length > this.props.activeShelterIds.length);
                        // this.props.highlightButton();
                    }}
                        style={{
                            float: 'right',
                            cursor: 'pointer',
                            color: '#198f35'
                        }}>
                        <span>
                            {this.props.shelters.length > this.props.activeShelterIds.length ? 'Select all' : 'Clear All'}
                        </span>
                    </span>
                    <br />

                    {this.renderShelters(this.props.shelters)}
                </List>}
                {this.props.loading && <Loader active inline='centered'>Loading Shelters</Loader>}
            </div>
        )
    }
}

export default SheltersList;