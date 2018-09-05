import _ from 'lodash';

export default (state = { loading: {}, activePetFilters: {}, shelterFilters: [] }, action) => {
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
          markers: Object.values(markers),
          loading: Object.assign({}, state.loading, {
            shelters: false
          })
        })
      } else {
        return Object.assign({}, state, {
          loading: Object.assign({}, state.loading, {
            shelters: false
          })
        })
      }
    case "RECEIVE_PETS":
      let pets = _.reduce(action.payload, (result, value, third) => {
        if (!_.isEmpty(value.petfinder.pets)) {
          return result.concat(value.petfinder.pets.pet);
        } else {
          return result;
        }
      }, []);

      function generatePetFilters(pet, fields) {
        fields.forEach((field) => {
          if (!petFilters[field]) {
            petFilters[field] = [];
          }
          petFilters[field].push(pet[field].$t);
          petFilters[field] = _.uniq(petFilters[field]);
        });
      }
      const petFilters = {};
      pets = _.map(pets, (pet) => {
        if (pet.media && pet.media.photos) {
          pet.media.photos.photo = _.filter(pet.media.photos.photo, (photo) => {
            return photo['@size'] === 'x'
          });
        }
        generatePetFilters(pet, ['animal', 'size', 'age', 'sex']);
        return pet;
      });
      return Object.assign({}, state, {
        pets: _.sortBy(pets, ['id.$t']),
        petsByShelter: _.groupBy(pets, 'shelterId.$t'),
        petFilters: petFilters,
        activePetFilters: {},
        loading: Object.assign({}, state.loading, {
          pets: false
        })
      });
    case "FETCH_PETS":
      return Object.assign({}, state, {
        loading: Object.assign({}, state.loading, {
          pets: true
        })
      });
    case "FETCH_SHELTERS":
      return Object.assign({}, state, {
        loading: Object.assign({}, state.loading, {
          shelters: true
        })
      })
    case "SET_CENTER":
      console.log('set center', action);
      return Object.assign({}, state, {
        center: action.payload
      });
    case "SET_UPDATE_OPTION":
      console.log('set update option', action);
      return Object.assign({}, state, {
        update: action.payload
      });
    case "SET_ACTIVE_PET_FILTERS":
      const activePetFilters = {
        [action.payload.field]: action.payload.value
      };
      return Object.assign({}, state, {
        activePetFilters: Object.assign({}, state.activePetFilters, activePetFilters)
      });
    case "ADD_SHELTER_FILTER": {
      console.log('ADD SHELTER FILTER', state.shelterFilters, action.payload);
      const shelterFilters = JSON.parse(JSON.stringify(state.shelterFilters));
      shelterFilters.push(action.payload)
      return Object.assign({}, state, {
        shelterFilters
      });
    }
    case "REMOVE_SHELTER_FILTER": {
      const shelterFilters = JSON.parse(JSON.stringify(state.shelterFilters));
      shelterFilters.splice(state.shelterFilters.indexOf(action.payload), 1);
      return Object.assign({}, state, {
        shelterFilters
      });
    }
    default:
      return state;
  }
};