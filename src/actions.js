import { getJSON } from 'jquery';

function fetchShelters(zip, bounds, zoom) {
  const req = getJSON(`https://api.petfinder.com/shelter.find?location=${zip}&count=${Math.round(1000/(zoom))}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);

  return {
    type: 'FETCH_SHELTERS',
    payload: req,
    meta: bounds
  }
}

export {
  fetchShelters
}