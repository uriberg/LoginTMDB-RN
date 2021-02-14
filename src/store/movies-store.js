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
        console.log('has been set through mobx!');
    }

    addToWishlist(movieTitle, id){
        if (this.wishlist.findIndex((element) => element.id === id) === -1){
            let currWishlist = [...this.wishlist, {movieTitle, id}];
            this.wishlist = currWishlist;
            console.log('added through mobx!');
        }
    }

    deleteFromWishlist(id) {
        let deletedIndex = this.wishlist.findIndex((element) => element.id === id);
        if (deletedIndex > -1){
            let currWishlist = [...this.wishlist];
            currWishlist.splice(deletedIndex, 1);
            this.wishlist = currWishlist;
            console.log('deleted through mobx!');
        }
    }
}

export default new MoviesStore();
