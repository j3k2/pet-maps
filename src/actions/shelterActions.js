import { get } from 'axios';
import { memoize } from 'lodash';

export const FETCH_SHELTERS = 'FETCH_SHELTERS';
export const RECEIVE_SHELTERS = 'RECEIVE_SHELTERS';
export const SET_MARKERS = 'SET_MARKERS';
export const REMOVE_SHELTER_FROM_ACTIVE = 'REMOVE_SHELTER_FROM_ACTIVE';
export const ADD_SHELTER_TO_ACTIVE = 'ADD_SHELTER_TO_ACTIVE';
export const TOGGLE_SHELTERS_ACTIVE = 'TOGGLE_SHELTERS_ACTIVE';
export const RESET_ACTIVE_SHELTERS = 'RESET_ACTIVE_SHELTERS';
export const CLEAR_PETS = 'CLEAR_PETS';
export const UPDATE_SHELTERS = 'UPDATE_SHELTERS';


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
    return {
        type: TOGGLE_SHELTERS_ACTIVE,
        payload: shelterIds
    };
}

export function resetActiveShelters(selected) {
    return {
        type: RESET_ACTIVE_SHELTERS,
        payload: selected
    };
}

export function updateShelters({ lat, lng, bounds, zoom }) {
    return async (dispatch) => {
        dispatch({
            type: CLEAR_PETS
        });

        const zip = await fetchZip(lat, lng); //memoized
        const shelters = await fetchShelters(zip, zoom, dispatch); //memoized
        const filteredShelters = filterShelters(shelters, bounds);

        dispatch({
            type: RECEIVE_SHELTERS,
            payload: filteredShelters
        });

        dispatch({
            type: SET_MARKERS,
            payload: filteredShelters
        });
    }
}

const filterShelters = (shelters, bounds, locations) => {
    return shelters.filter((shelter) => {
        return shelter.geocodeLat > bounds.sw.lat &&
            shelter.geocodeLat < bounds.ne.lat &&
            shelter.geocodeLng > bounds.sw.lng &&
            shelter.geocodeLng < bounds.ne.lng;
    });
}

const fetchShelters = memoize(async (zip, zoom, dispatch) => {
    dispatch({
        type: FETCH_SHELTERS
    });

    const response = await get(`/api/shelters?zip=${zip}&count=${Math.round(1000 / zoom)}`).catch((error) => {
        console.log('Error in fetchShelters: ' + error);
    });

    return response.data.shelters.map((shelter, idx) => {
        shelter.geocodeLat = response.data.locations[idx].lat;
        shelter.geocodeLng = response.data.locations[idx].lng;
        shelter.markerId = 'lat' + shelter.geocodeLat + 'lng' + shelter.geocodeLng;
        return shelter;
    });
});

const fetchZip = memoize(async (lat, lng) => {
    const response = await get(`/api/zip?lat=${lat}&lng=${lng}`).catch((error) => {
        console.log('Error in fetchZip: ' + error);
    });

    const zipObject = response.data.find((component) => {
        return component.types[0] === "postal_code"
    });
    
    const zip = zipObject ? zipObject.long_name : null;

    return zip;
})