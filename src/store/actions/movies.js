import * as actionTypes from './actionsTypes';

export const setPopularMovies = (popularMovies) => {
  return {
    type: actionTypes.SET_POPULAR_MOVIES,
    popularMovies: popularMovies,
  };
};

export const setWishlist = (wishlist) => {
  return {
    type: actionTypes.SET_WISHLIST,
    wishlist: wishlist,
  };
};

export const addToWishlist = (movieTitle, id) => {
  return (dispatch, getState) => {
    if (getState().movies.wishlist.findIndex((element) => element.id === id) === -1){
      let currWishlist = [...getState().movies.wishlist, {movieTitle, id}];
      dispatch(setWishlist(currWishlist));
    }
  };
};

export const deleteFromWishlist = (id) => {
  return (dispatch, getState) => {
    let deletedIndex = getState().movies.wishlist.findIndex((element) => element.id === id);
    if (deletedIndex > -1){
      let currWishlist = [...getState().movies.wishlist];
      currWishlist.splice(deletedIndex, 1);
      dispatch(setWishlist(currWishlist));
    }
  };
};
