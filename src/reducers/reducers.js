import { combineReducers } from 'redux';
import map from './mapReducer';
import shelters from './sheltersReducer';
import markers from './markersReducer';
import pets from './petsReducer';

export default combineReducers({
  map,
  markers,
  shelters,
  pets
});