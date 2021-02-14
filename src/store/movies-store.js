import { observable, action, makeObservable} from 'mobx';

class MoviesStore {
    popularMovies = [];
    wishlist = [];


    constructor() {
        makeObservable(this, {
            popularMovies: observable,
            wishlist: observable,
            setPopularMovies: action,
            addToWishlist: action,
            deleteFromWishlist: action,
        });
        // autorun(() => console.log(this.report));
    }

    setPopularMovies(popularMovies){
        this.popularMovies = popularMovies;
    }

    addToWishlist(movieTitle, id){
        if (this.wishlist.findIndex((element) => element.id === id) === -1){
            let currWishlist = [...this.wishlist, {movieTitle, id}];
            this.wishlist = currWishlist;
        }
    }

    deleteFromWishlist(id) {
        let deletedIndex = this.wishlist.findIndex((element) => element.id === id);
        if (deletedIndex > -1){
            let currWishlist = [...this.wishlist];
            currWishlist.splice(deletedIndex, 1);
            this.wishlist = currWishlist;
        }
    }
}

export default new MoviesStore();
