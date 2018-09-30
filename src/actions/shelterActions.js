import { get } from 'axios';

export const FETCH_SHELTERS = 'FETCH_SHELTERS';
export const RECEIVE_SHELTERS = 'RECEIVE_SHELTERS';
export const RECEIVE_MARKERS = 'RECEIVE_MARKERS';
export const REMOVE_SHELTER_FROM_ACTIVE = 'REMOVE_SHELTER_FROM_ACTIVE';
export const ADD_SHELTER_TO_ACTIVE = 'ADD_SHELTER_TO_ACTIVE';
export const TOGGLE_SHELTERS_ACTIVE = 'TOGGLE_SHELTERS_ACTIVE';
export const RESET_ACTIVE_SHELTERS = 'RESET_ACTIVE_SHELTERS';
export const CLEAR_PETS = 'CLEAR_PETS';

export function requestShelters(zip, zoom) {
    return get(`/api/shelters?zip=${zip}&count=${Math.round(1000 / zoom)}`);
}

export function fetchShelters({ zip, bounds, zoom }) {
    return (dispatch, getState) => {
        if (!bounds) {
            return;
        }
        dispatch({
            type: CLEAR_PETS
        })
        dispatch({
            type: FETCH_SHELTERS
        });
        requestShelters(zip, zoom)
            .then((res) => {
                dispatch({
                    type: RECEIVE_SHELTERS,
                    payload: res.data.shelters,
                    meta: {
                        locations: res.data.locations,
                        bounds
                    }
                })
                const { shelters } = getState();
                dispatch({
                    type: RECEIVE_MARKERS,
                    payload: shelters.items
                })
            }).catch((err) => {
                console.log(err);
                dispatch({
                    type: RECEIVE_SHELTERS,
                    meta: bounds
                })
            });
    }
}

export function setActiveShelter(shelterId, checked) {
    return (dispatch) => {
        if (checked) {
            dispatch({
                type: REMOVE_SHELTER_FROM_ACTIVE,
                payload: shelterId
            })
        } else {
            dispatch({
                type: ADD_SHELTER_TO_ACTIVE,
                payload: shelterId
            })
        }
    }
}


export function toggleSheltersActive(shelterIds) {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_SHELTERS_ACTIVE,
            payload: shelterIds
        });
    }
}


export function resetActiveShelters(selected) {
    return (dispatch) => {
        dispatch({
            type: RESET_ACTIVE_SHELTERS,
            payload: selected
        })
    }
}