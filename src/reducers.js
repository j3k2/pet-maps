import _ from 'lodash';

export default (state = { loading: {}, activeFilters: {} }, action) => {
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

      function generateFilters(pet, fields) {
        fields.forEach((field) => {
          if (!filters[field]) {
            filters[field] = [];
          }
          filters[field].push(pet[field].$t);
          filters[field] = _.uniq(filters[field]);
        });
      }
      const filters = {};
      pets = _.map(pets, (pet) => {
        if (pet.media && pet.media.photos) {
          pet.media.photos.photo = _.filter(pet.media.photos.photo, (photo) => {
            return photo['@size'] === 'x'
          });
        }
        generateFilters(pet, ['animal', 'age', 'size', 'sex',]);
        return pet;
      });
      return Object.assign({}, state, {
        pets: pets,
        filters: filters,
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
    case "SET_ACTIVE_FILTERS":
      const activeFilters = {
        [action.payload.field]: action.payload.value
      };
      return Object.assign({}, state, {
        activeFilters: Object.assign({}, state.activeFilters, activeFilters)
      });
    default:
      return state;
  }
};