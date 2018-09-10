import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Ref, Icon, List, Loader, Checkbox, Label, Segment, Button } from 'semantic-ui-react';
import { setActiveShelter, resetActiveShelters, updateMarkerHighlight } from './actions';

class SheltersList extends Component {
    constructor(props) {
        super(props);
        this.listRefs = {};
    }

    renderShelters(shelters) {
        const isShelterActive = (shelterId, markerId) => {
            return _.find(this.props.activeShelters, (activeShelter) => {
                return activeShelter.id.$t === shelterId;
            }) ? true : false;
        }

        return _.map(shelters, (shelter, idx) => {
            return (
                <Ref innerRef={(el) => {
                    this.listRefs[shelter.markerId] = this.listRefs[shelter.markerId] || [];
                    this.listRefs[shelter.markerId].push(el);
                }}>
                    <List.Item
                        key={idx}
                        style={{
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            borderRadius: 0,
                            borderLeft: this.props.highlightedMarker === shelter.markerId ? 'solid 4px #198f35' : 'none'
                        }}
                        onMouseEnter={() => {
                            this.props.updateMarkerHighlight(shelter.markerId, true);
                        }}
                        onMouseLeave={() => {
                            this.props.updateMarkerHighlight(shelter.markerId);
                        }}
                        onClick={(e, d) => {
                            this.props.setActiveShelter(shelter.id.$t, !isShelterActive(shelter.id.$t, shelter.markerId));
                            this.props.highlightButton();
                        }}
                    >
                        {/* <span>{shelter.markerId}:{shelter.latitude.$t}/{shelter.longitude.$t}</span> */}
                        <List.Content>
                            <List.Header>
                                {`${idx + 1}. ${shelter.name.$t}`}
                                <Checkbox checked={isShelterActive(shelter.id.$t, shelter.markerId)}
                                    onChange={(e, d) => {
                                        this.props.setActiveShelter(shelter.id.$t, d.checked);
                                        this.props.highlightButton();
                                    }}
                                    style={{ float: 'right', marginLeft: 10 }}></Checkbox>
                            </List.Header>
                            <List.Description>
                                {shelter.address1.$t ? `${shelter.address1.$t} (${shelter.zip.$t})` : shelter.zip.$t}
                                {/* {!this.props.loading.pets && pets && <div>
                                {_.map(_.countBy(pets[shelter.id.$t], 'animal.$t'), (value, key) => {
                                    return (
                                        <Label size="mini">
                                            {key}
                                            <Label.Detail>{value}</Label.Detail>
                                        </Label>
                                    )
                                })}
                            </div>}
                            {this.props.loading.pets && <Loader active size="mini" inline="left"></Loader>} */}

                            </List.Description>
                        </List.Content>
                        {/* <Icon style={{ float: 'right', marginLeft: 10 }} name={shelter.active ? "remove circle" : "add circle"}></Icon> */}
                    </List.Item>
                </Ref>);
        });
    }

    componentDidUpdate() {
        if (this.props.scrolledMarker && this.listRefs[this.props.scrolledMarker]) {
            const refs = this.listRefs[this.props.scrolledMarker];
            this.containerRef.scrollTop = _.min(_.map(refs, ref=>{
                return ref.offsetTop;
            })) - this.containerRef.offsetTop - 8;
        }
    }

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
                    // width: 454, 
                    width: 400,
                    background: 'white'
                }}>
                {!this.props.loading.shelters && this.props.shelters && <List
                    style={{ color: 'black' }}
                    selection
                    relaxed>
                    <a onClick={() => {
                        this.props.resetActiveShelters();
                        this.props.highlightButton();
                    }}
                        style={{
                            float: 'right',
                            cursor: 'pointer',
                            color: '#198f35',
                            opacity: this.props.shelters.length > this.props.activeShelters.length ? 1 : 0.4
                        }}>
                        <span>Select all
                        {/* {this.props.shelters.length}/{this.props.activeShelters.length} */}
                        </span></a>
                    <br />

                    {this.renderShelters(this.props.shelters)}
                </List>}
                {this.props.loading.shelters && <Loader active inline='centered'>Loading Shelters</Loader>}
            </div>
        )
    }
}

export default connect(state => {
    return {
        activeShelters: state.activeShelters,
        shelters: state.shelters,
        loading: state.loading,
        petsByShelter: state.petsByShelter,
        shelterFilters: state.shelterFilters,
        highlightedMarker: state.highlightedMarker,
        scrolledMarker: state.scrolledMarker
    }
}, { setActiveShelter, resetActiveShelters, updateMarkerHighlight })(SheltersList);