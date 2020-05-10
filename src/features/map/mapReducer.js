import { LOCATION_SEARCHED, MARKER_HOVERED, UPDATE_TOGGLED } from './mapActions';

import {
  MARKERS_RECEIVED,
  SHELTERS_RECEIVED,
  SHELTER_LIST_ITEM_HOVERED
} from '../shelters/shelterActions';

export default (state = {
  loading: {},
  center: null,
  update: true,
  markers: {},
  highlightedMarker: null
}, action) => {
  switch (action.type) {
    case LOCATION_SEARCHED:
      return {
        ...state,
        center: action.payload.center,
        update: action.payload.update
      };
    case UPDATE_TOGGLED:
      return {
        ...state,
        update: action.payload
      }
    case SHELTERS_RECEIVED: {
      return {
        ...state,
        markers: []
      }
    }
    case MARKERS_RECEIVED: {
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
    case MARKER_HOVERED: {
      return {
        ...state,
        highlightedMarker: action.payload
      };
    }
    case SHELTER_LIST_ITEM_HOVERED: {
      return {
        ...state,
        highlightedMarker: action.payload
      };
    }
    default:
      return state;
  }
}