import _ from 'lodash';
export default (state = {
    loading: false,
    items: []
}, action) => {
    switch (action.type) {
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
          items: _.sortBy(pets, ['id.$t']),
          petsByShelter: _.groupBy(pets, 'shelterId.$t'),
          petFilters: petFilters,
          activePetFilters: {},
          loading: false
        };
      case "FETCH_PETS":
        return {
          ...state,
          loading: true
        };
      case "SET_ACTIVE_PET_FILTERS":
        const activePetFilters = {
          [action.payload.field]: action.payload.value
        };
        return {
          ...state,
          activePetFilters: activePetFilters
        };
      
        default:
            return state;
    }
}


