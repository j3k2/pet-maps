import { uniq, sortBy } from 'lodash';
import {
  SHELTERS_REQUESTED,
  SHELTERS_RECEIVED,
  SHELTER_SELECTION_TOGGLED,
  ALL_SHELTERS_TOGGLED,
  MARKER_SHELTERS_TOGGLED
} from './shelterActions';

import {
  MARKER_HOVERED
} from '../map/mapActions';

export default (state = {
  loading: false,
  items: null,
  activeShelterIds: [],
  scrolledMarker: null
}, action) => {
  switch (action.type) {
    case SHELTERS_REQUESTED:
      return {
        ...state,
        loading: true
      }
    case SHELTER_SELECTION_TOGGLED: {
      if (action.payload.checked) {
        const activeShelterIds = state.activeShelterIds.filter((shelterId) => {
          return shelterId !== action.payload.shelterId;
        });
        return {
          ...state,
          activeShelterIds
        };
      } else {
        return {
          ...state,
          activeShelterIds: uniq([...state.activeShelterIds, action.payload.shelterId])
        };
      }

    }
    case ALL_SHELTERS_TOGGLED: {
      if (action.payload) {
        return {
          ...state,
          activeShelterIds: state.items.map((shelter) => {
            return shelter.id;
          })
        };
      } else {
        return {
          ...state,
          activeShelterIds: []
        };
      }
    }
    case MARKER_SHELTERS_TOGGLED: {
      const sheltersActive = [];
      const shelterIdsInactive = [];
      const shelterIds = action.payload;
      let activeShelterIds = state.activeShelterIds;

      shelterIds.forEach(shelterId => {
        const activeShelter = activeShelterIds.find(activeShelter => {
          return activeShelter === shelterId;
        });
        if (activeShelter) {
          shelterIdsInactive.push(shelterId);
        } else {
          sheltersActive.push(shelterId);
        }
      })

      if (shelterIdsInactive.length) {
        activeShelterIds = activeShelterIds.filter(activeShelter => {
          return shelterIdsInactive.indexOf(activeShelter) === -1;
        });
      }

      return {
        ...state,
        activeShelterIds: [].concat(activeShelterIds, sheltersActive)
      }
    }
    case SHELTERS_RECEIVED: {
      return {
        ...state,
        items: sortBy(action.payload, ['markerId']).reverse(),
        activeShelterIds: action.payload.map((shelter) => {
          return shelter.id;
        }),
        loading: false
      }
    }
    case MARKER_HOVERED: {
      return {
        ...state,
        scrolledMarker: action.payload
      };
    }
    default:
      return state;
  }
}