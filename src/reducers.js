import { combineReducers } from 'redux';
import map from './state/map/mapReducer';
import shelters from './state/shelters/sheltersReducer';
import pets from './state/pets/petsReducer';

export default combineReducers({
  map,
  shelters,
  pets
});