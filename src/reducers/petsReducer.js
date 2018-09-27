import { reduce, isEmpty, uniq, find, filter, sortBy, groupBy } from 'lodash';

import {
  RECEIVE_PETS,
  FETCH_PETS,
  SET_ACTIVE_PET_FILTERS,
} from '../actions/petActions';
import {
  CLEAR_PETS
} from '../actions/shelterActions';

export default (state = {
  loading: false,
  items: null
}, action) => {
  switch (action.type) {
    case RECEIVE_PETS:
      let pets = reduce(action.payload.res, (result, value, third) => {
        if (!isEmpty(value.petfinder.pets)) {
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
          petFilters[field] = uniq(petFilters[field]);
        });
      }

      function setShelterName(pet, shelters) {
        const shelter = find(shelters, (shelter) => {
          return pet.shelterId.$t === shelter.id.$t;
        });
        pet.shelterName = shelter.name.$t || null;
      }

      const petFilters = {};
      pets = pets.map((pet) => {
        if (pet.media && pet.media.photos) {
          pet.media.photos.photo = filter(pet.media.photos.photo, (photo) => {
            return photo['@size'] === 'x'
          });
        }
        setShelterName(pet, action.payload.shelters.items);
        generatePetFilters(pet, ['animal', 'size', 'age', 'sex']);
        return pet;
      });
      return {
        ...state,
        items: sortBy(pets, ['id.$t']),
        petsByShelter: groupBy(pets, 'shelterId.$t'),
        petFilters: petFilters,
        activePetFilters: {},
        loading: false
      };
    case FETCH_PETS:
      return {
        ...state,
        loading: true
      };
    case SET_ACTIVE_PET_FILTERS:
      const activePetFilters = {
        [action.payload.field]: action.payload.value
      };
      return {
        ...state,
        activePetFilters: activePetFilters
      };
    case CLEAR_PETS:
      return {
        items: null
      };
    default:
      return state;
  }
}


