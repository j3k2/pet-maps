import { getJSON } from 'jquery';
import Geocode from 'react-geocode';

function fetchShelters(coordinates) {
  const req = Geocode.fromLatLng(coordinates.lat(), coordinates.lng()).then(
    response => {
      const zip = response.results[0].address_components[7].long_name;
      return zip;
    }
  ).then(function (zip) {
    return getJSON(`https://api.petfinder.com/shelter.find?location=${zip}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`)
  });
  return {
    type: 'FETCH_SHELTERS',
    payload: req
  }
}

export {
  fetchShelters
}