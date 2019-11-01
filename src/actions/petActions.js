import { get } from 'axios';
export const FETCH_PETS = 'FETCH_PETS';
export const RECEIVE_PETS = 'RECEIVE_PETS';
export const SET_ACTIVE_PET_FILTERS = 'SET_ACTIVE_PET_FILTERS';

export function fetchPets(shelterIds) {
    return (dispatch, getState) => {
        dispatch({
            type: FETCH_PETS
        });

        const requests = shelterIds.map((shelterId) => {
            return get(`/api/pets?shelterId=${shelterId}`);
        });

        Promise.all(requests)
            .then((res) => {
                const { shelters } = getState();
                dispatch({
                    type: RECEIVE_PETS,
                    payload: {
                        pets: res.reduce((pets, currentRes) => {
                            return pets.concat(currentRes.data);
                        }, []),
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
