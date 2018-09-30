import { SET_CENTER, SET_UPDATE_OPTION, GET_ZIP } from '../actions/mapActions';

export default (state = {
    loading: {},
    center: null,
    update: true,
    zip: null,
    bounds: null,
    zoom: null
}, action) => {
    switch (action.type) {
        case SET_CENTER:
            return {
                ...state,
                center: action.payload
            };
        case SET_UPDATE_OPTION:
            return {
                ...state,
                update: action.payload
            };
        case GET_ZIP:
            return {
                ...state,
                zip: action.payload.long_name,
                bounds: action.meta.bounds,
                zoom: action.meta.zoom
            }
        default:
            return state;
    }
}