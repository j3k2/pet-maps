import { get } from 'superagent';
import {
  LOCATION_SEARCHED,
  MARKER_HOVERED,
  UPDATE_TOGGLED
} from './mapConstants';

function locationSearched(query) {
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

function updateToggled(val) {
  return {
    type: UPDATE_TOGGLED,
    payload: val
  };
}

function markerHovered(markerId) {
  return {
    type: MARKER_HOVERED,
    payload: markerId
  };
}

export {
  locationSearched,
  updateToggled,
  markerHovered
}
