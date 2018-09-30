import { get } from 'axios';
import { find } from 'lodash';

export const SET_CENTER = 'SET_CENTER';
export const SET_UPDATE_OPTION = 'SET_UPDATE_OPTION';
export const SET_MARKER_HIGHLIGHT = 'SET_MARKER_HIGHLIGHT';
export const SET_MARKER_SCROLL = 'SET_MARKER_SCROLL';
export const GET_ZIP = 'GET_ZIP';

export function setCenterAndUpdateMap(query) {
    return (dispatch) => {
        return get(`/api/location?query=${query}`)
            .then(response => {
                dispatch({
                    type: SET_CENTER,
                    payload: response.data
                });
                dispatch(setUpdateOption(true));
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export function setUpdateOption(val) {
    return (dispatch) => {
        dispatch({
            type: SET_UPDATE_OPTION,
            payload: val
        });
    }
}
export function setMarkerHighlight(markerId) {
    return (dispatch) => {
        dispatch({
            type: SET_MARKER_HIGHLIGHT,
            payload: markerId
        });
    }
}

export function setMarkerScroll(markerId) {
    return (dispatch) => {
        dispatch({
            type: SET_MARKER_SCROLL,
            payload: markerId
        });
    }
}

export function getZip({ lat, lng, bounds, zoom }) {
    return (dispatch) => {
        return get(`/api/zip?lat=${lat}&lng=${lng}`)
            .then(response => {
                const zip = find(response.data, (component) => {
                    return component.types[0] === "postal_code"
                });
                dispatch({
                    type: GET_ZIP,
                    payload: zip,
                    meta: {
                        bounds,
                        zoom
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}