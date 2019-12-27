// import { uniq, sortBy } from 'lodash';

import {
  RECEIVE_PETS,
  FETCH_PETS,
  RECEIVE_MORE_PETS,
  SET_ACTIVE_PET_FILTERS,
} from '../actions/petActions';
import {
  RESET_SHELTERS
} from '../actions/shelterActions';

export default (state = {
  loading: false,
  items: null,
  pagination: {}
}, action) => {
  switch (action.type) {
    case RECEIVE_PETS: {
      let pets = action.payload.pets;

      // function generatePetFilters(pet, fields) {
      //   fields.forEach((field) => {
      //     if (!petFilters[field]) {
      //       petFilters[field] = [];
      //     }
      //     petFilters[field].push(pet[field]);
      //     petFilters[field] = uniq(petFilters[field]);
      //   });
      // }

      function setShelterName(pet, shelters) {
        const shelter = shelters.find((shelter) => {
          return pet.organization_id === shelter.id;
        });
        pet.shelterName = shelter.name || null;
      }

      // const petFilters = {};
      pets = pets.map((pet) => {
        if (pet.photos) {
          pet.photos = pet.photos.map((photo) => {
            return photo.full
          });
        }
        setShelterName(pet, action.payload.shelters.items);
        // generatePetFilters(pet, ['species', 'size', 'age', 'gender']);
        return pet;
      });
      return {
        ...state,
        items: pets,
        // items: sortBy(pets, 'id'),
        // petFilters: petFilters,
        // activePetFilters: {},
        pagination: action.payload.pagination,
        loading: false
      };
    }
    case FETCH_PETS: 
      return {
        ...state,
        loading: true
      };
    case RECEIVE_MORE_PETS: {
      let pets = action.payload.pets;
      function setShelterName(pet, shelters) {
        const shelter = shelters.find((shelter) => {
          return pet.organization_id === shelter.id;
        });
        pet.shelterName = shelter.name || null;
      }

      pets = pets.map((pet) => {
        if (pet.photos) {
          pet.photos = pet.photos.map((photo) => {
            return photo.full
          });
        }
        setShelterName(pet, action.payload.shelters.items);
        return pet;
      });
      pets = state.items.concat(pets);
      return {
        ...state,
        items: pets,
        pagination: action.payload.pagination,
        loading: false
      };
    }
    case SET_ACTIVE_PET_FILTERS:
      const activePetFilters = Object.assign({}, state.activePetFilters, {
        [action.payload.field]: action.payload.value
      });
      return {
        ...state,
        activePetFilters: activePetFilters
      };
    case RESET_SHELTERS:
      return {
        items: null
      };
    default:
      return state;
  }
}


