import { getJSON } from 'jquery';
import _ from 'lodash';


function requestShelters(zip, zoom) {
  return getJSON(`https://api.petfinder.com/shelter.find?location=${zip}&count=${Math.round(1000 / (zoom))}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
}

function fetchShelters(zip, bounds, zoom) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_SHELTERS'
    });

    requestShelters(zip, zoom)
      .then((res) => {
        console.log('###shelters: ', res);
        dispatch({
          type: 'RECEIVE_SHELTERS',
          payload: res,
          meta: bounds
        })
      })
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
    if(checked) {
      dispatch({
        type:'ADD_SHELTER_TO_ACTIVE',
        payload: shelterId
      })
    } else {
      dispatch({
        type:'REMOVE_SHELTER_FROM_ACTIVE',
        payload: shelterId
      })    
    }
  }
}

function fetchPets(shelters) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_PETS'
    });
    const requests = _.map(shelters, (shelter) => {
      return getJSON(`https://api.petfinder.com/shelter.getPets?id=${shelter.id.$t}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
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

function resetActiveShelters(){
  return (dispatch) => {
    dispatch({
      type: 'RESET_ACTIVE_SHELTERS'
    })
  }
}
export {
  fetchShelters,
  fetchPets,
  setCenterAndUpdateMap,
  setUpdateOption,
  setActivePetFilters,
  setActiveShelter,
  resetActiveShelters
}