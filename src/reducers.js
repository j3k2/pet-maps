import { combineReducers } from 'redux';
import map from './features/map/mapReducer';
import shelters from './features/shelters/sheltersReducer';
import pets from './features/pets/petsReducer';

export default combineReducers({
  map,
  shelters,
  pets
});