import { getJSON } from 'jquery';
import _ from 'lodash';


function requestShelters(zip, zoom) {
  return getJSON(`https://api.petfinder.com/shelter.find?location=${zip}&count=${Math.round(1000/(zoom))}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
}

function fetchShelters(zip, bounds, zoom) {
  return (dispatch) => {
    dispatch({
      type: 'REQUEST_SHELTERS'
    });

    requestShelters(zip, zoom)
      .then((res)=>{
        console.log('###shelters: ', res);
        dispatch({
          type: 'RECEIVE_SHELTERS',
          payload: res,
          meta: bounds
        })
      })
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
      .then((res)=>{
        console.log('###pets: ', res);
        dispatch({
          type: 'RECEIVE_PETS',
          payload: res
        })
      })


    return {
      type: 'FETCH_PETS',
      payload: Promise.all(requests)
    }
  }
  
} 

export {
  fetchShelters,
  fetchPets
}