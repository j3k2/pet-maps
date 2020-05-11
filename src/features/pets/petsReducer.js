// import { uniq, sortBy } from 'lodash';
import {
  PETS_REQUESTED,
  PETS_RECEIVED,
  // SET_ACTIVE_PET_FILTERS,
} from './petsConstants';
import {
  SHELTERS_RECEIVED
} from '../shelters/sheltersConstants';

export default (state = {
  loading: false,
  items: null,
  pagination: {}
}, action) => {
  switch (action.type) {
    case PETS_RECEIVED: {
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
        setShelterName(pet, action.payload.shelters);
        // generatePetFilters(pet, ['species', 'size', 'age', 'gender']);
        return pet;
      });
      if (action.payload.pagination.current_page > 1) {
        pets = state.items.concat(pets);
      }
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
    case PETS_REQUESTED:
      return {
        ...state,
        loading: true
      };
    case SHELTERS_RECEIVED:
      return {
        items: null
      };
    default:
      return state;
  }
}


