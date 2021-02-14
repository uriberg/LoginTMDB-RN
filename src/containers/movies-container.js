import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';
import axiosInstance from '../axios';
import {Text, View, StyleSheet, Dimensions, FlatList, TouchableHighlight} from 'react-native';
// import {NavigationScreenProps} from 'react-navigation';
// @ts-ignore
import {TMDB_API_KEY} from '@env';

// interface PropsFromDispatch {
//   onSetPopularMovies: () => void,
//   onAddToWishlist: (title: string) => void
// }
//
// interface PropsFromState {
//   popularMovies: [],
//   wishlist: []
// }

// type AllProps = NavigationScreenProps & PropsFromDispatch & PropsFromState;

const Item = ({title}) => (
  <View style={styles.itemText}>
      <Text>{title}</Text>
  </View>
);

class MoviesContainer extends React.Component {

    constructor(props) {
        super(props);

        const isPortrait = () => {
            const dim = Dimensions.get('window');
            return dim.height >= dim.width ? 'portrait' : 'landscape';
        };
    }

    componentDidMount() {
        // console.log(TMDB_API_KEY);
        axiosInstance().get('/3/movie/popular?api_key=' + TMDB_API_KEY + '&language=en-US&page=1')
          .then(result => {
              this.props.onSetPopularMovies(result.data.results);
          })
          .catch(error => console.log(error));
    }

    addToWishlist = (movieTitle) => {
      this.props.onAddToWishlist(movieTitle);
    };

    renderSeparator = () => {
        return <View style={styles.itemSeparator}/>;
    };

    renderHeader = () => {
        return (
          <View>
              <Text style={styles.header}>Popular Movies</Text>
          </View>
        );
    };

    renderItem = ({item}) => (
      <TouchableHighlight onPress={() =>
        this.props.navigation.navigate('Movie', {
            id: item.id,
            title: item.title,
            poster_path: item.poster_path,
            overview: item.overview,
            rating: item.vote_average,
            wishlist: this.props.wishlist,
            addToWishlist: this.addToWishlist,
        })}
                          underlayColor={'#f1f1f1'}>
          <View style={styles.listItem}>
              <Item title={item.title} key={item.title}/>
          </View>
      </TouchableHighlight>
    );

    render() {
        return (
          <View style={styles.listContainer}>
              <FlatList
                data={this.props.popularMovies}
                renderItem={this.renderItem}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
                contentContainerStyle={{
                    flexGrow: 1,
                }}/>
          </View>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    popularMovies: state.movies.popularMovies,
    wishlist: state.movies.wishlist,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetPopularMovies: (popularList) => dispatch(actions.setPopularMovies(popularList)),
    onAddToWishlist: (title) => dispatch(actions.addToWishlist(title)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviesContainer);

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        zIndex: 5,
        backgroundColor: 'white',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    itemText: {
        justifyContent: 'center',
        maxWidth: 150,
    },
    itemSeparator: {
        backgroundColor: 'green',
        height: 1,
    },
    header: {
        fontSize: 30,
        paddingVertical: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#DCDCDC',
    },
});

