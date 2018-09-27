import { getJSON } from 'jquery';

export const FETCH_PETS = 'FETCH_PETS';
export const RECEIVE_PETS = 'RECEIVE_PETS';
export const SET_ACTIVE_PET_FILTERS = 'SET_ACTIVE_PET_FILTERS';

export function fetchPets(shelterIds) {
    return (dispatch) => {
        dispatch({
            type: FETCH_PETS
        });

        const requests = shelterIds.map((shelterId) => {
            return getJSON(`https://api.petfinder.com/shelter.getPets?id=${shelterId}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
        });

        Promise.all(requests)
            .then((res) => {
                dispatch({
                    type: RECEIVE_PETS,
                    payload: res
                });
            });
    }
}

export function setActivePetFilters(value, field) {
    return (dispatch) => {
        dispatch({
            type: SET_ACTIVE_PET_FILTERS,
            payload: {
                value,
                field
            }
        });
    }
};