import { get } from 'superagent';

export const SET_CENTER = 'SET_CENTER';
export const SET_UPDATE_OPTION = 'SET_UPDATE_OPTION';
export const SET_MARKER_HIGHLIGHT = 'SET_MARKER_HIGHLIGHT';

export function setCenterAndUpdateOption(query) {
  return async (dispatch) => {
    const response = await get('/api/location')
      .query({ query }).catch((error) => {
        console.log('Error in setCenterAndUpdateOption: ' + error);
      });
    dispatch(setCenter(response.body));
    dispatch(setUpdateOption(true));
  }
}

export function setCenter(center) {
  return {
    type: SET_CENTER,
    payload: center
  };
}

export function setUpdateOption(val) {
  return {
    type: SET_UPDATE_OPTION,
    payload: val
  };
}
export function setMarkerHighlight(markerId) {
  return {
    type: SET_MARKER_HIGHLIGHT,
    payload: markerId
  };
}