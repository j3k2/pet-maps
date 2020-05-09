import { get } from 'superagent';
export const FETCH_PETS = 'FETCH_PETS';
export const RECEIVE_PETS = 'RECEIVE_PETS';
export const SET_ACTIVE_PET_FILTERS = 'SET_ACTIVE_PET_FILTERS';
export const FETCH_MORE_PETS = 'FETCH_MORE_PETS';
export const RECEIVE_MORE_PETS = 'RECEIVE_MORE_PETS';

export function fetchPets(shelterIds) {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_PETS
    });
    
    const response = await get('/api/pets')
      .query({
        shelterIds,
        page: 1
      }).catch((error) => {
        console.log('Error in fetchPets: ' + error);
      });

    const { shelters } = getState();
    dispatch({
      type: RECEIVE_PETS,
      payload: {
        pets: response.body.pets,
        pagination: response.body.pagination,
        shelters
      }
    });
  }
}

export function fetchMorePets(currentPage) {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_PETS
    });

    const response = await get('/api/pets')
      .query({
        shelterIds: getState().shelters.activeShelterIds,
        page: currentPage + 1
      }).catch((error) => {
        console.log('Error in fetchPets: ' + error);
      });
      const { shelters } = getState();

    dispatch({
      type: RECEIVE_MORE_PETS,
      payload: {
        pets: response.body.pets,
        pagination: response.body.pagination,
        shelters
      }
    });
  }
}

export function setActivePetFilters(value, field) {
  return {
    type: SET_ACTIVE_PET_FILTERS,
    payload: {
      value,
      field
    }
  };
};
