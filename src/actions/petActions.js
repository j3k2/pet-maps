import { get } from 'superagent';
export const FETCH_PETS = 'FETCH_PETS';
export const RECEIVE_PETS = 'RECEIVE_PETS';
export const SET_ACTIVE_PET_FILTERS = 'SET_ACTIVE_PET_FILTERS';

export function fetchPets(shelterIds) {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_PETS
    });
    
    const response = await get('/api/pets')
      .query({
        shelterIds
      }).catch((error) => {
        console.log('Error in fetchPets: ' + error);
      });

    const { shelters } = getState();
    
    dispatch({
      type: RECEIVE_PETS,
      payload: {
        pets: response.body.pets,
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
