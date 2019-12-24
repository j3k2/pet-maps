import {
  SET_MARKER_HIGHLIGHT,
  SET_MARKER_SCROLL
} from '../actions/mapActions';

import {
  SET_MARKERS,
  RESET_SHELTERS,
  TOGGLE_SHELTERS_ACTIVE,
  ADD_SHELTER_TO_ACTIVE,
  REMOVE_SHELTER_FROM_ACTIVE
} from '../actions/shelterActions';

export default (state = {
  items: {},
  highlightedMarker: null,
  scrolledMarker: null
}, action) => {
  switch (action.type) {
    case ADD_SHELTER_TO_ACTIVE: {
      const markers = state.items;
      markers.forEach(marker => {
        if (marker.shelterIds.indexOf(action.payload) > -1) {
          marker.inactive = false;
        }
      })
      return {
        ...state,
        items: markers
      }
    }
    case REMOVE_SHELTER_FROM_ACTIVE: {
      const markers = state.items;
      markers.forEach(marker => {
        if (marker.shelterIds.indexOf(action.payload) > -1) {
          marker.inactive = true;
        }
      })
      return {
        ...state,
        items: markers
      }
    }
    case TOGGLE_SHELTERS_ACTIVE: {
      const shelterIds = action.payload;
      const markers = state.items;
      markers.forEach(marker => {
        if (marker.shelterIds === shelterIds) {
          marker.inactive = !marker.inactive;
        }
      });
      return {
        ...state,
        items: markers
      }
    }
    case RESET_SHELTERS: {
      return {
        ...state,
        items: []
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
