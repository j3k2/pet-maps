import _ from 'lodash';

export default (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_SHELTERS':
      if (action.payload.petfinder && action.payload.petfinder.shelters && action.payload.petfinder.shelters.shelter) {
        const shelters = _.filter(action.payload.petfinder.shelters.shelter, (shelter) => {
          const lat = parseFloat(shelter.latitude.$t);
          const lng = parseFloat(shelter.longitude.$t);
          const bounds = action.meta;
          return lat >= bounds.f.b &&
            lat <= bounds.f.f &&
            lng >= bounds.b.b &&
            lng <= bounds.b.f
        });
        const markers = {};
        shelters.forEach((shelter) => {
          if (markers[('lat' + shelter.latitude.$t + 'lng' + shelter.longitude.$t)]) {
            markers[('lat' + shelter.latitude.$t + 'lng' + shelter.longitude.$t)].shelters.push(shelter);
          } else {
            markers[('lat' + shelter.latitude.$t + 'lng' + shelter.longitude.$t)] = { lat: shelter.latitude.$t, lng: shelter.longitude.$t };
            markers[('lat' + shelter.latitude.$t + 'lng' + shelter.longitude.$t)].shelters = [];
            markers[('lat' + shelter.latitude.$t + 'lng' + shelter.longitude.$t)].shelters.push(shelter);
          }
        });

        return Object.assign({}, state, {
          shelters,
          markers: Object.values(markers)
        })
      } else {
        return state;
      }
    case "RECEIVE_PETS":
      let pets = _.reduce(action.payload, (result, value) => {
        return result.concat(value.petfinder.pets.pet);
      }, []);
      pets = _.map(pets, (pet) => {
        if (pet && pet.media.photos) {
          pet.media.photos.photo = _.filter(pet.media.photos.photo, (photo) => {
            return photo['@size'] === 'x'
          });
        }
        return pet;
      })
      console.log(pets);
      return Object.assign({}, state, {
        pets: pets
      });
    case "SET_CENTER":
      return Object.assign({}, state, {
        center: action.payload
      });
    default:
      return state;
  }
};