import { getJSON } from 'jquery';
import Geocode from 'react-geocode';
import _ from 'lodash';

function fetchShelters(coordinates) {
  const req = Geocode.fromLatLng(coordinates.lat(), coordinates.lng()).then(
    response => {
      const zip = _.find(response.results[0].address_components, (component) => {
        return component.types[0] === "postal_code"
      }).long_name;
      return zip;
    }
  ).then(function (zip) {
    return getJSON(`https://api.petfinder.com/shelter.find?location=${zip}&count=100&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`)
  });
  return {
    type: 'FETCH_SHELTERS',
    payload: req
  }
}

export {
  fetchShelters
}