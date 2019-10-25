import { uniq, reject, find, filter, sortBy, difference } from 'lodash';
import {
    FETCH_SHELTERS,
    ADD_SHELTER_TO_ACTIVE,
    REMOVE_SHELTER_FROM_ACTIVE,
    RESET_ACTIVE_SHELTERS,
    TOGGLE_SHELTERS_ACTIVE,
    RECEIVE_SHELTERS
} from '../actions/shelterActions';

export default (state = {
    loading: false,
    items: [],
    fetched: false,
    activeShelterIds: []
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
            const activeShelterIds = reject(state.activeShelterIds, (shelterId) => {
                return shelterId === action.payload;
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
                        return shelter.id.$t;
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
                const activeShelter = find(activeShelterIds, activeShelter => {
                    return activeShelter === shelterId;
                });
                if (activeShelter) {
                    shelterIdsInactive.push(shelterId);
                } else {
                    sheltersActive.push(shelterId);
                }
            })

            if (shelterIdsInactive.length) {
                activeShelterIds = reject(activeShelterIds, activeShelter => {
                    return shelterIdsInactive.indexOf(activeShelter) > -1;
                });
            }

            return {
                ...state,
                activeShelterIds: [].concat(activeShelterIds, sheltersActive)
            }
        }
        case RECEIVE_SHELTERS: {
            const shelters = filter(action.payload || state.items, (shelter, idx) => {
                shelter.geocodeLat = action.meta.locations[idx].lat;
                shelter.geocodeLng = action.meta.locations[idx].lng;
                shelter.markerId = 'lat' + shelter.geocodeLat + 'lng' + shelter.geocodeLng;
                return shelter.geocodeLat > action.meta.bounds.sw.lat &&
                    shelter.geocodeLat < action.meta.bounds.ne.lat &&
                    shelter.geocodeLng > action.meta.bounds.sw.lng &&
                    shelter.geocodeLng < action.meta.bounds.ne.lng;
            });
            const incomingShelterIds = shelters.map((shelter) => {
                return shelter.id.$t;
            });
            const existingShelterIds = state.items.map((shelter) => {
                return shelter.id.$t;
            });
            return {
                ...state,
                items: sortBy(shelters, ['markerId']).reverse(),
                fetched: true,
                activeShelterIds: difference(incomingShelterIds, existingShelterIds).length ? shelters.map((shelter) => {
                    return shelter.id.$t;
                }) : state.activeShelterIds,
                loading: false
            }
        }
        default:
            return state;
    }
}