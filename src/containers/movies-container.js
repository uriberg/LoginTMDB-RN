import React from 'react';
import axiosInstance from '../axios';
import {Text, View, StyleSheet, Dimensions, FlatList, TouchableHighlight, Animated} from 'react-native';
import {TMDB_API_KEY} from '@env';
import { inject, observer } from "mobx-react";


const Item = ({title}) => (
  <View style={styles.itemText}>
      <Text>{title}</Text>
  </View>
);

class MoviesContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            animation: new Animated.Value(0)
        };

        this.animateOpacity();
    }

    componentDidMount() {
        axiosInstance().get('/3/movie/popular?api_key=' + TMDB_API_KEY + '&language=en-US&page=1')
          .then(result => {
              this.props.store.setPopularMovies(result.data.results);
          })
          .catch(error => console.log(error));
    }

    animateOpacity = () => {
        Animated.timing(this.state.animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    };

    addToWishlist = (movieTitle) => {
      this.props.store.addToWishlist(movieTitle);
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
        const animatedStyles = {
            opacity: this.state.animation
        };

        return (
          <Animated.View style={[styles.listContainer, animatedStyles]}>
              <FlatList
                data={this.props.store.popularMovies}
                renderItem={this.renderItem}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
                contentContainerStyle={{
                    flexGrow: 1,
                }}/>
          </Animated.View>
        );
    }
}

export default inject("store")(observer(MoviesContainer));

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

