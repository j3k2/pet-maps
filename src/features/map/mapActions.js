import { get } from 'superagent';

export const LOCATION_SEARCHED = 'LOCATION_SEARCHED';
export const MARKER_HOVERED = 'MARKER_HOVERED';
export const UPDATE_TOGGLED = 'UPDATE_TOGGLED';

export function locationSearched(query) {
  return async (dispatch) => {
    const response = await get('/api/location')
      .query({ query }).catch((error) => {
        console.log('Error in locationSearched: ' + error);
      });
    dispatch({
      type: LOCATION_SEARCHED,
      payload: {
        center: response.body,
        update: true
      }
    })
  }
}

export function updateToggled(val) {
  return {
    type: UPDATE_TOGGLED,
    payload: val
  };
}

export function markerHovered(markerId) {
  return {
    type: MARKER_HOVERED,
    payload: markerId
  };
}
