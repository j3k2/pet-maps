import {
    SET_MARKER_HIGHLIGHT,
    SET_MARKER_SCROLL
} from '../actions/mapActions';

import {
    RECEIVE_MARKERS
} from '../actions/shelterActions';

export default (state = {
    items: {},
    highlightedMarker: null,
    scrolledMarker: null
}, action) => {
    switch (action.type) {
        case RECEIVE_MARKERS: {
            const shelters = action.payload;
            const markers = {};
            shelters.forEach((shelter) => {
                if (markers[shelter.markerId]) {
                    markers[shelter.markerId].shelterIds.push(shelter.id.$t);
                } else {
                    markers[shelter.markerId] = {
                        lat: shelter.geocodeLat,
                        lng: shelter.geocodeLng,
                        markerId: shelter.markerId
                    };
                    markers[shelter.markerId].shelterIds = [];
                    markers[shelter.markerId].shelterIds.push(shelter.id.$t);
                }
            });
            return {
                items: Object.values(markers)
            }
        }
        case SET_MARKER_HIGHLIGHT: {
            return {
                ...state,
                highlightedMarker: action.payload
            };
        }
        case SET_MARKER_SCROLL: {
            return {
                ...state,
                scrolledMarker: action.payload
            };
        }
        default:
            return state;
    }
}
