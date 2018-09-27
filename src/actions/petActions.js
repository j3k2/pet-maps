import { getJSON } from 'jquery';
import _ from 'lodash';

export const FETCH_PETS = 'FETCH_PETS';
export const RECEIVE_PETS = 'RECEIVE_PETS';
export const SET_ACTIVE_PET_FILTERS = 'SET_ACTIVE_PET_FILTERS';

export function fetchPets(shelterIds) {
    return (dispatch, getState) => {
        dispatch({
            type: FETCH_PETS
        });

        const requests = _.map(shelterIds, (shelterId) => {
            return getJSON(`https://api.petfinder.com/shelter.getPets?id=${shelterId}&key=90d01a3ac254f887ffd89ccb11322d58&format=json&callback=?`);
        });

        Promise.all(requests)
            .then((res) => {
                const { shelters } = getState();
                dispatch({
                    type: RECEIVE_PETS,
                    payload: {
                        res,
                        shelters
                    }
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
