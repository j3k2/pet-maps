export default (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SHELTERS':
      return Object.assign({}, state, {
        shelters: action.payload.petfinder ? action.payload.petfinder.shelters.shelter : []
      })
    default:
      return state
  }
};