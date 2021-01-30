import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
  popularMovies: [],
  wishlist: [],
};

const setPopularMovies = (state, action) => {
  return updateObject(state, {popularMovies: action.popularMovies});
};

const setWishlist = (state, action) => {
  return updateObject(state, {wishlist: action.wishlist});
};

const movies = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_WISHLIST: return setWishlist(state, action);
    case actionTypes.SET_POPULAR_MOVIES: return setPopularMovies(state, action);
    default:
      return state;
  }
};

export default movies;
