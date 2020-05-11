import { get } from 'superagent';
import {
  PETS_REQUESTED,
  PETS_RECEIVED,
  // SET_ACTIVE_PET_FILTERS,
} from './petsConstants';

function petsRequested(currentPage) {
  return async (dispatch, getState) => {
    dispatch({
      type: PETS_REQUESTED
    });

    const sheltersState = getState().shelters;

    if (!sheltersState.activeShelterIds.length) {
      dispatch({
        type: PETS_RECEIVED,
        payload: {
          pets: []
        }
      });
      return;
    }

    const response = await get('/api/pets')
      .query({
        shelterIds: sheltersState.activeShelterIds,
        page: (currentPage ? currentPage : 0) + 1
      }).catch((error) => {
        console.log('Error in petsRequested: ' + error);
      });

    dispatch({
      type: PETS_RECEIVED,
      payload: {
        pets: response.body.pets,
        pagination: response.body.pagination,
        shelters: sheltersState.items
      }
    });
  }
}

// function setActivePetFilters(value, field) {
//   return {
//     type: SET_ACTIVE_PET_FILTERS,
//     payload: {
//       value,
//       field
//     }
//   };
// };

export {
  petsRequested
}