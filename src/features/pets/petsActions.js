import { get } from 'superagent';
import {
  PETS_RECEIVED,
  PETS_REQUESTED,
  MORE_PETS_RECEIVED,
  // SET_ACTIVE_PET_FILTERS,
} from './petsConstants';

function petsRequested(shelterIds) {
  return async (dispatch, getState) => {
    dispatch({
      type: PETS_REQUESTED
    });

    if(!shelterIds.length) {
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
        shelterIds,
        page: 1
      }).catch((error) => {
        console.log('Error in petsRequested: ' + error);
      });

    const { shelters } = getState();
    dispatch({
      type: PETS_RECEIVED,
      payload: {
        pets: response.body.pets,
        pagination: response.body.pagination,
        shelters
      }
    });
  }
}

function morePetsRequested(currentPage) {
  return async (dispatch, getState) => {
    dispatch({
      type: PETS_REQUESTED
    });

    const response = await get('/api/pets')
      .query({
        shelterIds: getState().shelters.activeShelterIds,
        page: currentPage + 1
      }).catch((error) => {
        console.log('Error in petsRequested: ' + error);
      });
      const { shelters } = getState();

    dispatch({
      type: MORE_PETS_RECEIVED,
      payload: {
        pets: response.body.pets,
        pagination: response.body.pagination,
        shelters
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
  petsRequested,
  morePetsRequested
}