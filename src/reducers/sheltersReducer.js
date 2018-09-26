import _ from 'lodash';
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
    items: null,
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
                activeShelterIds: _.uniq([...state.activeShelterIds, action.payload])
            };
        }
        case REMOVE_SHELTER_FROM_ACTIVE: {
            const activeShelterIds = _.reject(state.activeShelterIds, (shelterId) => {
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
                    activeShelterIds: _.map(state.items, 'id.$t')
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

            _.each(shelterIds, shelterId => {
                const activeShelter = _.find(activeShelterIds, activeShelter => {
                    return activeShelter === shelterId;
                });
                if (activeShelter) {
                    shelterIdsInactive.push(shelterId);
                } else {
                    sheltersActive.push(shelterId);
                }
            })

            if (shelterIdsInactive.length) {
                activeShelterIds = _.reject(activeShelterIds, activeShelter => {
                    return shelterIdsInactive.indexOf(activeShelter) > -1;
                });
            }

            return {
                ...state,
                activeShelterIds: [].concat(activeShelterIds, sheltersActive)
            }
        }
        case RECEIVE_SHELTERS: {
            const shelters = _.filter(action.payload || state.items, (shelter, idx) => {
                shelter.geocodeLat = action.meta.locations[idx].lat;
                shelter.geocodeLng = action.meta.locations[idx].lng;
                shelter.markerId = 'lat' + shelter.geocodeLat + 'lng' + shelter.geocodeLng;

                return shelter.geocodeLat > (action.meta.bounds.f.b + 0.0) && //bottom buffer
                    shelter.geocodeLat < (action.meta.bounds.f.f - 0) && //top buffer
                    shelter.geocodeLng > (action.meta.bounds.b.b + 0) && //left buffer
                    shelter.geocodeLng < (action.meta.bounds.b.f - 0); //right buffer
            });
            const incomingShelterIds = _.map(shelters, 'id.$t');
            const existingShelterIds = _.map(state.items, 'id.$t');
            return {
                ...state,
                items: _.sortBy(shelters, ['markerId']).reverse(),
                activeShelterIds: _.difference(incomingShelterIds, existingShelterIds).length ? _.map(shelters, 'id.$t') : state.activeShelterIds,
                loading: false
            }
        }
        default:
            return state;
    }
}