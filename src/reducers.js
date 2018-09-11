import _ from 'lodash';

export default (state = { loading: {}, activePetFilters: {}, shelterFilters: [] }, action) => {
  switch (action.type) {
    case 'RECEIVE_SHELTERS': {
      const shelters = _.filter(action.payload || state.shelters, (shelter, idx) => {
        shelter.geocodeLat = action.meta.locations[idx].lat;
        shelter.geocodeLng = action.meta.locations[idx].lng;

        return shelter.geocodeLat > (action.meta.bounds.f.b + .001) && //bottom buffer
          shelter.geocodeLat < (action.meta.bounds.f.f - .002) && //top buffer
          shelter.geocodeLng > (action.meta.bounds.b.b + 0) && //left buffer
          shelter.geocodeLng < (action.meta.bounds.b.f - 0); //right buffer
      });
      const markers = {};
      shelters.forEach((shelter) => {
        shelter.markerId = 'lat' + shelter.geocodeLat + 'lng' + shelter.geocodeLng;
        if (markers[shelter.markerId]) {
          markers[shelter.markerId].shelterIds.push(shelter.id.$t);
        } else {
          markers[shelter.markerId] = {
            lat: shelter.geocodeLat,
            lng: shelter.geocodeLng,
            markerId: shelter.markerId
          };
          markers[shelter.markerId].shelterIds = [];
          markers[shelter.markerId].shelterIds.push(shelter.id.$t);
        }
      });
      console.log('markers', Object.values(markers));
      return {
        ...state,
        shelters: _.sortBy(shelters, ['markerId']).reverse(),
        activeShelters: shelters,
        markers: Object.values(markers),
        loading: {
          ...state.loading,
          shelters: false
        }
      }
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
      return {
        ...state,
        pets: _.sortBy(pets, ['id.$t']),
        petsByShelter: _.groupBy(pets, 'shelterId.$t'),
        petFilters: petFilters,
        activePetFilters: {},
        loading: {
          ...state.loading,
          pets: false
        }
      };
    case "FETCH_PETS":
      return {
        ...state,
        loading: {
          ...state.loading,
          pets: true
        }
      };
    case "FETCH_SHELTERS":
      return {
        ...state,
        loading: {
          ...state.loading,
          shelters: true
        },
        pets: {},
        shelters: {},
        activeShelters: {},
        petFilters: {},
        activePetFilters: {}
      }
    case "SET_CENTER":
      return {
        ...state,
        center: action.payload
      };
    case "SET_UPDATE_OPTION":
      return {
        ...state,
        update: action.payload
      };
    case "SET_ACTIVE_PET_FILTERS":
      const activePetFilters = {
        [action.payload.field]: action.payload.value
      };
      return {
        ...state,
        activePetFilters: activePetFilters
      };
    case "ADD_SHELTER_TO_ACTIVE": {
      let activeShelters = state.activeShelters;
      const shelter = _.find(state.shelters, (shelter) => { return shelter.id.$t === action.payload });
      activeShelters.push(shelter)
      return {
        ...state,
        activeShelters: _.uniqBy(activeShelters, 'id.$t')
      };
    }
    case "REMOVE_SHELTER_FROM_ACTIVE": {
      const activeShelters = _.reject(state.activeShelters, (shelter) => {
        return shelter.id.$t === action.payload;
      });
      return {
        ...state,
        activeShelters
      };
    }
    case "RESET_ACTIVE_SHELTERS": {
      if(action.payload) {
        return {
          ...state,
          activeShelters: JSON.parse(JSON.stringify(state.shelters))
        };
      } else {
        return {
          ...state,
          activeShelters: []
        };
      }
    }
    case "SET_MARKER_HIGHLIGHT": {
      return {
        ...state,
        highlightedMarker: action.payload
      };
    }
    case "SET_MARKER_SCROLL": {
      return {
        ...state,
        scrolledMarker: action.payload
      };
    }
    case "TOGGLE_SHELTERS_ACTIVE": {
      const sheltersActive = [];
      const shelterIdsInactive = [];
      const shelterIds = action.payload;
      let activeShelters = state.activeShelters;

      _.each(shelterIds, shelterId => {
        const activeShelter = _.find(activeShelters, activeShelter => {
          return activeShelter.id.$t === shelterId;
        });
        if (activeShelter) {
          shelterIdsInactive.push(shelterId);
        } else {
          sheltersActive.push(_.find(state.shelters, shelter => {
            return shelter.id.$t === shelterId;
          }));
        }
      })

      if (shelterIdsInactive.length) {
        activeShelters = _.reject(activeShelters, activeShelter => {
          return shelterIdsInactive.indexOf(activeShelter.id.$t) > -1;
        });
      }

      return {
        ...state,
        activeShelters: [].concat(activeShelters, sheltersActive)
      }
    }
    default:
      return state;
  }
};