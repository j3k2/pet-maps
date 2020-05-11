import { get } from 'superagent';
import { memoize } from 'lodash';
import { constants } from '../../config';
import {
  SHELTERS_REQUESTED,
  SHELTERS_RECEIVED,
  MARKERS_RECEIVED,
  SHELTER_SELECTION_TOGGLED,
  MARKER_SHELTERS_TOGGLED,
  ALL_SHELTERS_TOGGLED,
  SHELTER_LIST_ITEM_HOVERED
} from './sheltersConstants';

function shelterSelectionToggled(shelterId, checked) {
  return {
    type: SHELTER_SELECTION_TOGGLED,
    payload: {
      shelterId,
      checked
    }
  }
}

function markerSheltersToggled(shelterIds) {
  return {
    type: MARKER_SHELTERS_TOGGLED,
    payload: shelterIds
  };
}

function allSheltersToggled(selected) {
  return {
    type: ALL_SHELTERS_TOGGLED,
    payload: selected
  };
}

function shelterListItemHovered(markerId) {
  return {
    type: SHELTER_LIST_ITEM_HOVERED,
    payload: markerId
  };
}

function mapUpdated({ lat, lng, bounds, zoom }) {
  return async (dispatch) => {
    const shelters = await fetchShelters(lat, lng, zoom, dispatch); //memoized
    const filteredShelters = filterShelters(shelters, bounds);

    dispatch({
      type: SHELTERS_RECEIVED,
      payload: filteredShelters
    });

    dispatch({
      type: MARKERS_RECEIVED,
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
    type: SHELTERS_REQUESTED
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

export {
  shelterSelectionToggled,
  markerSheltersToggled,
  allSheltersToggled,
  mapUpdated,
  shelterListItemHovered
}