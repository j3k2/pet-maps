import {getJSON} from 'jquery';
import Geocode from 'react-geocode';
import _ from 'lodash';

export const FETCH_SHELTERS = 'FETCH_SHELTERS';
export const RECEIVE_SHELTERS = 'RECEIVE_SHELTERS';
export const RECEIVE_MARKERS = 'RECEIVE_MARKERS';
export const REMOVE_SHELTER_FROM_ACTIVE = 'REMOVE_SHELTER_FROM_ACTIVE';
export const ADD_SHELTER_TO_ACTIVE = 'ADD_SHELTER_TO_ACTIVE';
export const TOGGLE_SHELTERS_ACTIVE = 'TOGGLE_SHELTERS_ACTIVE';
export const RESET_ACTIVE_SHELTERS = 'RESET_ACTIVE_SHELTERS';

export function requestShelters(zip, zoom) {
    return getJSON(`https://api.petfinder.com/shelter.find?location=${zip}&count=${Math.round(1000 / (zoom))}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
}

export function fetchShelters({ zip, bounds, zoom, disableFetch }) {
    return (dispatch, getState) => {

        dispatch({
            type: FETCH_SHELTERS
        });
        requestShelters(zip, zoom)
            .then((res) => {
                if (res.petfinder &&
                    res.petfinder.shelters &&
                    res.petfinder.shelters.shelter) {
                    const geocodeShelters = _.map(res.petfinder.shelters.shelter, shelter => {
                        return Geocode.fromAddress(`${shelter.address1.$t}, ${shelter.zip.$t}`)
                            .then((geocodeRes) => {
                                if (geocodeRes.results[0].geometry.location.lat && geocodeRes.results[0].geometry.location.lng) {
                                    return {
                                        lat: geocodeRes.results[0].geometry.location.lat,
                                        lng: geocodeRes.results[0].geometry.location.lng
                                    }
                                }
                            })
                            .catch(() => {
                                return {
                                    lat: parseFloat(shelter.latitude.$t),
                                    lng: parseFloat(shelter.longitude.$t)
                                }
                            })
                    });

                    Promise.all(geocodeShelters).then(locations => {
                        dispatch({
                            type: RECEIVE_SHELTERS,
                            payload: res.petfinder.shelters.shelter,
                            meta: {
                                locations,
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
                    })
                } else {
                    dispatch({
                        type: RECEIVE_SHELTERS,
                        meta: bounds
                    })
                }
            }).catch((err) => {
                console.log(err);
                dispatch({
                    type: RECEIVE_SHELTERS,
                    meta: bounds
                });
            })
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