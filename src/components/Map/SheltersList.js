import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Ref, List, Loader, Checkbox } from 'semantic-ui-react';
import { setActiveShelter, resetActiveShelters } from '../../actions/shelterActions';
import { setMarkerHighlight } from '../../actions/mapActions';

class SheltersList extends Component {
    constructor(props) {
        super(props);
        this.listRefs = {};
    }

    renderShelters(shelters) {
        return _.map(shelters, (shelter, idx) => {
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
                            this.props.setActiveShelter(shelter.id.$t, this.props.activeShelterIds.indexOf(shelter.id.$t) > -1);
                            this.props.highlightButton();
                        }}
                    >
                        {/* <span>{shelter.markerId}:{shelter.latitude.$t}/{shelter.longitude.$t}</span> */}
                        <List.Content>
                            <List.Header>
                                {`${idx + 1}. ${shelter.name.$t}`}
                                <Checkbox checked={this.props.activeShelterIds.indexOf(shelter.id.$t) > -1}
                                    // onClick={(e, d) => {
                                    //     this.props.setActiveShelter(shelter.id.$t, d.checked);
                                    //     this.props.highlightButton();
                                    // }}
                                    style={{ float: 'right', marginLeft: 10 }}></Checkbox>
                            </List.Header>
                            <List.Description>
                                {shelter.address1.$t ? `${shelter.address1.$t} (${shelter.zip.$t})` : shelter.zip.$t}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                </Ref>);
        });
    }

    componentDidUpdate() {
        if (this.props.scrolledMarker && this.listRefs[this.props.scrolledMarker]) {
            const refs = this.listRefs[this.props.scrolledMarker];
            const offsets = _.map(refs, ref => {
                return ref.offsetTop;
            });
            this.containerRef.scrollTop =
                _.min(offsets) -
                this.containerRef.offsetTop -
                parseInt(this.containerRef.style.paddingTop, 10) -
                parseInt(this.containerRef.style.paddingBottom, 10);
        }
        if (!this.props.shelters || !this.props.shelters.length) {
            // reset listRefs when shelters are refetched
            this.listRefs = {};
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
                    <a onClick={() => {
                        this.props.resetActiveShelters(this.props.shelters.length > this.props.activeShelterIds.length);
                        this.props.highlightButton();
                    }}
                        style={{
                            float: 'right',
                            cursor: 'pointer',
                            color: '#198f35'
                        }}>
                        <span>
                            {this.props.shelters.length > this.props.activeShelterIds.length ? 'Select all' : 'Clear All'}
                        </span>
                    </a>
                    <br />

                    {this.renderShelters(this.props.shelters)}
                </List>}
                {this.props.loading && <Loader active inline='centered'>Loading Shelters</Loader>}
            </div>
        )
    }
}

export default connect(state => {
    return {
        activeShelterIds: state.shelters.activeShelterIds,
        shelters: state.shelters.items,
        loading: state.shelters.loading,
        petsByShelter: state.shelters.petsByShelter,
        shelterFilters: state.shelters.shelterFilters,
        highlightedMarker: state.markers.highlightedMarker,
        scrolledMarker: state.markers.scrolledMarker
    }
}, { setActiveShelter, resetActiveShelters, setMarkerHighlight })(SheltersList);