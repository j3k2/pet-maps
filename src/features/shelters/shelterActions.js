import { get } from 'superagent';
import { memoize } from 'lodash';
import { constants } from '../../config';

export const FETCH_SHELTERS = 'FETCH_SHELTERS';
export const RECEIVE_SHELTERS = 'RECEIVE_SHELTERS';
export const SET_MARKERS = 'SET_MARKERS';
export const REMOVE_SHELTER_FROM_ACTIVE = 'REMOVE_SHELTER_FROM_ACTIVE';
export const ADD_SHELTER_TO_ACTIVE = 'ADD_SHELTER_TO_ACTIVE';
export const TOGGLE_SHELTERS_ACTIVE = 'TOGGLE_SHELTERS_ACTIVE';
export const RESET_ACTIVE_SHELTERS = 'RESET_ACTIVE_SHELTERS';
export const RESET_SHELTERS = 'RESET_SHELTERS';
export const UPDATE_SHELTERS = 'UPDATE_SHELTERS';
export const SET_MARKER_SCROLL = 'SET_MARKER_SCROLL';


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
      type: RESET_SHELTERS
    });
    
    const shelters = await fetchShelters(lat, lng, zoom, dispatch); //memoized
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

const filterShelters = (shelters, bounds) => {
  return shelters.filter((shelter) => {
    return shelter.geocodeLat > bounds.sw.lat &&
      shelter.geocodeLat < bounds.ne.lat &&
      shelter.geocodeLng > bounds.sw.lng &&
      shelter.geocodeLng < bounds.ne.lng;
  });
}

const fetchShelters = memoize(async (lat, lng, zoom, dispatch) => {
  dispatch({
    type: FETCH_SHELTERS
  });

  const mapWidth = constants.MAP_SIZE;
  const mapRadiusInPixels = Math.sqrt(Math.pow(mapWidth / 2, 2) + Math.pow(mapWidth / 2, 2));
  const mapRadiusInMiles = (97.27130 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom)) * mapRadiusInPixels;
// https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
// https://medium.com/techtrument/how-many-miles-are-in-a-pixel-a0baf4611fff

  const response = await get('/api/shelters')
    .query({
      lat,
      lng, 
      distance: mapRadiusInMiles
    }).catch((error) => {
      console.log('Error in fetchShelters: ' + error);
    });

  return response.body.shelters.map((shelter, idx) => {
    shelter.geocodeLat = response.body.locations[idx].lat;
    shelter.geocodeLng = response.body.locations[idx].lng;
    shelter.markerId = 'lat' + shelter.geocodeLat + 'lng' + shelter.geocodeLng;
    return shelter;
  });
});

export function setMarkerScroll(markerId) {
  return {
    type: SET_MARKER_SCROLL,
    payload: markerId
  };
}