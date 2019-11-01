import { get } from 'axios';

export const SET_CENTER = 'SET_CENTER';
export const SET_UPDATE_OPTION = 'SET_UPDATE_OPTION';
export const SET_MARKER_HIGHLIGHT = 'SET_MARKER_HIGHLIGHT';
export const SET_MARKER_SCROLL = 'SET_MARKER_SCROLL';

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