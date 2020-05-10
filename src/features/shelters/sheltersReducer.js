import { uniq, sortBy } from 'lodash';
import {
    FETCH_SHELTERS,
    ADD_SHELTER_TO_ACTIVE,
    REMOVE_SHELTER_FROM_ACTIVE,
    RESET_ACTIVE_SHELTERS,
    TOGGLE_SHELTERS_ACTIVE,
    RECEIVE_SHELTERS,
    SET_MARKER_SCROLL
} from './shelterActions';

export default (state = {
    loading: false,
    items: null,
    activeShelterIds: [],
    scrolledMarker: null
}, action) => {
    switch (action.type) {
        case FETCH_SHELTERS:
            return {
                ...state,
                loading: true
            }
        case ADD_SHELTER_TO_ACTIVE: {
            return {
                ...state,
                activeShelterIds: uniq([...state.activeShelterIds, action.payload])
            };
        }
        case REMOVE_SHELTER_FROM_ACTIVE: {
            const activeShelterIds = state.activeShelterIds.filter((shelterId) => {
                return shelterId !== action.payload;
            });
            return {
                ...state,
                activeShelterIds
            };
        }
        case RESET_ACTIVE_SHELTERS: {
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
        case TOGGLE_SHELTERS_ACTIVE: {
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
        case RECEIVE_SHELTERS: {
            return {
                ...state,
                items: sortBy(action.payload, ['markerId']).reverse(),
                activeShelterIds: action.payload.map((shelter) => {
                    return shelter.id;
                }),
                loading: false
            }
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