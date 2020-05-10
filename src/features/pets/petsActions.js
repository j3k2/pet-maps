import { get } from 'superagent';
export const PETS_REQUESTED = 'PETS_REQUESTED';
export const PETS_RECEIVED = 'PETS_RECEIVED';
// export const SET_ACTIVE_PET_FILTERS = 'SET_ACTIVE_PET_FILTERS';
// export const MORE_PETS_REQUESTED = 'MORE_PETS_REQUESTED';
export const MORE_PETS_RECEIVED = 'MORE_PETS_RECEIVED';

export function petsRequested(shelterIds) {
  return async (dispatch, getState) => {
    dispatch({
      type: PETS_REQUESTED
    });
    
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

export function morePetsRequested(currentPage) {
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

// export function setActivePetFilters(value, field) {
//   return {
//     type: SET_ACTIVE_PET_FILTERS,
//     payload: {
//       value,
//       field
//     }
//   };
// };
