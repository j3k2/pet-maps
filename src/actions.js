import { getJSON } from 'jquery';
import _ from 'lodash';
import Geocode from 'react-geocode';


function requestShelters(zip, zoom) {
  return getJSON(`https://api.petfinder.com/shelter.find?location=${zip}&count=${Math.round(1000 / (zoom))}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
}

function fetchSheltersAndMarkers({zip, bounds, zoom, disableFetch}) {
  return (dispatch) => {
      dispatch({
        type: 'FETCH_SHELTERS'
      });

      requestShelters(zip, zoom)
        .then((res) => {
          if (res.petfinder &&
            res.petfinder.shelters &&
            res.petfinder.shelters.shelter) {
            const geocodeShelters = _.map(res.petfinder.shelters.shelter, shelter => {
              return Geocode.fromAddress(`${shelter.address1.$t}, ${shelter.zip.$t}`)
                .then((geocodeRes) => {
                  if (geocodeRes.results[0].geometry.location.lat && geocodeRes.results[0].geometry.location.lng) {
                    return {
                      lat: geocodeRes.results[0].geometry.location.lat,
                      lng: geocodeRes.results[0].geometry.location.lng
                    }
                  }
                })
                .catch(() => {
                  return {
                    lat: parseFloat(shelter.latitude.$t),
                    lng: parseFloat(shelter.longitude.$t)
                  }
                })
            });

            Promise.all(geocodeShelters).then(locations => {
              dispatch({
                type: 'RECEIVE_SHELTERS',
                payload: res.petfinder.shelters.shelter,
                meta: {
                  locations,
                  bounds
                }
              })
            }).catch((err) => {
              console.log(err);
              dispatch({
                type: 'RECEIVE_SHELTERS',
                meta: bounds
              })
            })
          } else {
            dispatch({
              type: 'RECEIVE_SHELTERS',
              meta: bounds
            })
          }
        }).catch((err) => {
          console.log(err);
          dispatch({
            type: 'RECEIVE_SHELTERS',
            meta: bounds
          });
        });
  }
}

function setCenterAndUpdateMap(lat, lng) {
  return (dispatch) => {
    dispatch({
      type: 'SET_CENTER',
      payload: { lat, lng }
    });
    dispatch(setUpdateOption(true));
  }
}

function setUpdateOption(val) {
  return (dispatch) => {
    dispatch({
      type: 'SET_UPDATE_OPTION',
      payload: val
    });
  }
}

function setActiveShelter(shelterId, checked) {
  return (dispatch) => {
    if (checked) {
      dispatch({
        type: 'REMOVE_SHELTER_FROM_ACTIVE',
        payload: shelterId
      })
    } else {
      dispatch({
        type: 'ADD_SHELTER_TO_ACTIVE',
        payload: shelterId
      })
    }
  }
}

function fetchPets(shelterIds) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_PETS'
    });
    const requests = _.map(shelterIds, (shelterId) => {
      return getJSON(`https://api.petfinder.com/shelter.getPets?id=${shelterId}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
    });

    Promise.all(requests)
      .then((res) => {
        dispatch({
          type: 'RECEIVE_PETS',
          payload: res
        });
      })

    return {
      type: 'FETCH_PETS',
      payload: Promise.all(requests)
    }
  }
}

function setActivePetFilters(value, field) {
  return (dispatch) => {
    dispatch({
      type: 'SET_ACTIVE_PET_FILTERS',
      payload: {
        value,
        field
      }
    });
  }
};

function resetActiveShelters(selected) {
  return (dispatch) => {
    dispatch({
      type: 'RESET_ACTIVE_SHELTERS',
      payload: selected
    })
  }
}

function setMarkerHighlight(markerId) {
  return (dispatch) => {
    dispatch({
      type: 'SET_MARKER_HIGHLIGHT',
      payload: markerId
    });
  }
}

function setMarkerScroll(markerId) {
  return (dispatch) => {
    dispatch({
      type: 'SET_MARKER_SCROLL',
      payload: markerId
    });
  }
}

function toggleSheltersActive(shelterIds) {
  return (dispatch) => {
    dispatch({
      type: 'TOGGLE_SHELTERS_ACTIVE',
      payload: shelterIds
    });
  }
}

export {
  fetchSheltersAndMarkers,
  fetchPets,
  setCenterAndUpdateMap,
  setUpdateOption,
  setActivePetFilters,
  setActiveShelter,
  resetActiveShelters,
  setMarkerHighlight,
  setMarkerScroll,
  toggleSheltersActive
}