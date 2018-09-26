export default (state = {
    loading: {},
    center: null,
    update: true
}, action) => {
    switch (action.type) {
        case "SET_CENTER":
            return {
                ...state,
                center: action.payload
            };
        case "SET_UPDATE_OPTION":
            return {
                ...state,
                update: action.payload
            };
        default:
            return state;
    }
}