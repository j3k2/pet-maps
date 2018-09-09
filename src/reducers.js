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
          shelter.markerId = 'lat' + shelter.latitude.$t + 'lng' + shelter.longitude.$t;
          if (markers[shelter.markerId]) {
            markers[shelter.markerId].shelters.push(shelter);
          } else {
            markers[shelter.markerId] = {
              lat: shelter.latitude.$t,
              lng: shelter.longitude.$t,
              markerId: shelter.markerId
            };
            markers[shelter.markerId].shelters = [];
            markers[shelter.markerId].shelters.push(shelter);
          }
        });

        console.log('MARKERS', markers);

        return Object.assign({}, state, {
          shelters: _.sortBy(shelters, ['markerId']),
          activeShelters: shelters,
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
        }),
        pets: {},
        shelters: {},
        activeShelters: {},
        petFilters: {},
        activePetFilters: {}
      })
    case "SET_CENTER":
      return Object.assign({}, state, {
        center: action.payload
      });
    case "SET_UPDATE_OPTION":
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
    case "ADD_SHELTER_TO_ACTIVE": {
      let activeShelters = JSON.parse(JSON.stringify(state.activeShelters));
      const shelter = _.find(JSON.parse(JSON.stringify(state.shelters)), (shelter) => { return shelter.id.$t === action.payload });
      activeShelters.push(shelter)
      return Object.assign({}, state, {
        activeShelters
      });
    }
    case "REMOVE_SHELTER_FROM_ACTIVE": {
      const activeShelters = _.reject(JSON.parse(JSON.stringify(state.activeShelters)), (shelter) => {
        return shelter.id.$t === action.payload;
      });
      return Object.assign({}, state, {
        activeShelters
      });
    }
    case "RESET_ACTIVE_SHELTERS": {
      return Object.assign({}, state, {
        activeShelters: JSON.parse(JSON.stringify(state.shelters))
      });
    }
    case "REMOVE_MARKER_HIGHLIGHT": {
      const markers = _.map(state.markers, (marker) => {
        if (marker.markerId === action.payload) {
          marker.highlight = false;
        }
        return marker;
      });
      const shelters = _.map(state.shelters, (shelter) => {
        if (shelter.markerId === action.payload) {
          shelter.highlight = false;
        }
        return shelter;
      })
      return Object.assign({}, state, {
        markers,
        shelters
      });
    }
    case "ADD_MARKER_HIGHLIGHT": {
      const markers = _.map(state.markers, (marker) => {
        if (marker.markerId === action.payload) {
          marker.highlight = true;
        }
        return marker;
      });
      const shelters = _.map(state.shelters, (shelter) => {
        if (shelter.markerId === action.payload) {
          shelter.highlight = true;
        }
        return shelter;
      })
      return Object.assign({}, state, {
        markers,
        shelters
      });
    }
    default:
      return state;
  }
};