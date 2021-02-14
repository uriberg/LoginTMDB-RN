import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, Animated} from "react-native";
// import { NavigationScreenProps } from "react-navigation";
import {observer, inject} from 'mobx-react'

// import * as actions from "../store/actions";
// import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import { LogBox } from "react-native";
import WishlistItem from "../components/wishlistItem";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state"
]);

// interface MovieProps extends NavigationScreenProps {
//   route: NavigationScreenProps
// }
//
// interface PropsFromDispatch {
//   onAddToWishlist: (title: string, id: number) => void,
//   onDeleteFromWishlist: (id: number) => void
// }
//
// interface PropsFromState {
//   wishlist: []
// }
//
// interface State {
//   showModal: boolean
// }

// type AllProps = MovieProps & PropsFromDispatch & PropsFromState;
const createAnimationStyle = animation => {
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 0],
  });

  return {
    opacity: animation,
    transform: [
      {
        translateY,
      },
    ],
  };
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class Movie extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      animation: new Animated.Value(0),
      headline: new Animated.Value(0),
      poster: new Animated.Value(0),
      description: new Animated.Value(0),
      wishlistItem: new Animated.Value(1),
      activeItem: -1
    };

    this.animateOpacity();
    this.animateStagger();
  }

  animateOpacity = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  };

  animateStagger = () => {
    Animated.stagger(300, [
      Animated.timing(this.state.headline, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(this.state.poster, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(this.state.description, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
    ]).start();
  };

  showModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  deleteItemFromWishlist = (id) => {
    this.props.store.deleteFromWishlist(id);
  };


  render() {
    const animatedStyles = {
      opacity: this.state.animation
    };

    const animatedWishlistItemStyle = {
      opacity: this.state.wishlistItem
    };

    const headlineStyle = createAnimationStyle(this.state.headline);
    const posterImageStyle = createAnimationStyle(this.state.poster);
    const descriptionStyle = createAnimationStyle(this.state.description);

    return (
      <View style={styles.movieContainer}>
        <AnimatedTouchable style={[styles.favoriteButtonWrapper, animatedStyles]}>
          <Icon.Button
            name="heart"
            onPress={this.showModal}
            size={30}
            backgroundColor="transparent"
            color="red">
            <Text style={styles.favoriteNumberText}>{this.props.store.wishlist.length}</Text>
          </Icon.Button>
        </AnimatedTouchable>
        <ScrollView>
          <View style={styles.movieDetails}>
            <Animated.View style={[styles.movieHeadline, headlineStyle]}>
              <Text style={[styles.movieText, styles.movieTitle]}>{this.props.route.params.title}</Text>
              <Text style={styles.movieText}>{this.props.route.params.rating}</Text>
            </Animated.View>

            <Animated.View style={posterImageStyle}>
              <Image style={styles.moviePoster}
                     source={{ uri: "https://image.tmdb.org/t/p/original" + this.props.route.params.poster_path }} />
            </Animated.View>
            <Animated.View style={[styles.movieDescription, descriptionStyle]}>
              <Text style={styles.movieText}>{this.props.route.params.overview}</Text>
            </Animated.View>
          </View>
        </ScrollView>


        <AnimatedTouchable
          onPress={() => this.props.store.addToWishlist(this.props.route.params.title, this.props.route.params.id)}
          style={[styles.centerButton, animatedStyles]}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add to wishlist</Text>
          </View>
        </AnimatedTouchable>
        <Modal transparent={true} visible={this.state.showModal}>
          <View style={styles.outsideModalWrapper}>
            <View style={styles.insideModalWrapper}>
              <Icon.Button name="remove" onPress={this.closeModal} size={20} backgroundColor="orange" color="black"
                           style={styles.wishlistHeadline}>
                <Text>My Wishlist</Text>
              </Icon.Button>
              <View>
                {this.props.store.wishlist.map((item) =>
                    <WishlistItem id={item.id} key={item.id}
                    deleteItemFromWishlist={this.deleteItemFromWishlist}
                    movieTitle={item.movieTitle}/>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     wishlist: state.movies.wishlist,
//   };
// };
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     onAddToWishlist: (title, id) => dispatch(actions.addToWishlist(title, id)),
//     onDeleteFromWishlist: (id) => dispatch(actions.deleteFromWishlist(id)),
//   };
// };

export default inject("store")(observer(Movie));

const styles = StyleSheet.create({
  movieContainer: {
    backgroundColor: 'black', flex: 1,
  },
  favoriteButtonWrapper: {
    width: 60, backgroundColor: 'black', alignSelf: 'flex-end'
  },
  favoriteNumberText: {
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
    right: 20,
    top: 2,
  },
  movieDetails: {
    marginBottom: 'auto',
    marginTop: 20,
    justifyContent: 'center',
  },
  movieHeadline: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 20,
  },
  moviePoster: {
    width: 250, height: 350, alignSelf: 'center',
  },
  movieText: {
    color: 'orange',
    fontSize: 15,
  },
  movieTitle: {
    maxWidth: 250,
  },
  centerButton: {
    alignSelf: "center",
  },
  movieDescription: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  outsideModalWrapper: {
    backgroundColor: '#000000aa', flex: 1,
  },
  insideModalWrapper: {
    backgroundColor: '#ffffff', marginHorizontal: 35, marginVertical: 50, borderRadius: 10, flex: 1,
  },
  wishlistHeadline: {
    textAlign: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  wishlistItemWrapper: {
    padding: 10,
  },
  wishlistItemContent: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  wishlistItemTitle: {
    maxWidth: 100,
  },
  wishlistItemSeparator: {
    backgroundColor: 'green', height: 1, marginTop: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#1b387f',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignSelf: 'stretch',
    width: 399,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
  },
});
