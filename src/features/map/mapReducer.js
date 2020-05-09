import { SET_CENTER, SET_UPDATE_OPTION, SET_MARKER_HIGHLIGHT } from './mapActions';

import {
  SET_MARKERS,
  RESET_SHELTERS
} from '../shelters/shelterActions';

export default (state = {
  loading: {},
  center: null,
  update: true,
  markers: {},
  highlightedMarker: null
}, action) => {
  switch (action.type) {
    case SET_CENTER:
      return {
        ...state,
        center: action.payload
      };
    case SET_UPDATE_OPTION:
      return {
        ...state,
        update: action.payload
      };
    case RESET_SHELTERS: {
      return {
        ...state,
        markers: []
      }
    }
    case SET_MARKERS: {
      const shelters = action.payload;
      const markers = {};
      shelters.forEach((shelter) => {
        if (markers[shelter.markerId]) {
          markers[shelter.markerId].shelterIds.push(shelter.id);
        } else {
          markers[shelter.markerId] = {
            lat: shelter.geocodeLat,
            lng: shelter.geocodeLng,
            markerId: shelter.markerId
          };
          markers[shelter.markerId].shelterIds = [];
          markers[shelter.markerId].shelterIds.push(shelter.id);
        }
      });
      return {
        ...state,
        markers: Object.values(markers)
      }
    }
    case SET_MARKER_HIGHLIGHT: {
      return {
        ...state,
        highlightedMarker: action.payload
      };
    }
    default:
      return state;
  }
}