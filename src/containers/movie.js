import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
// import { NavigationScreenProps } from "react-navigation";
import * as actions from "../store/actions";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import { LogBox } from "react-native";

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

class Movie extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  deleteItemFromWishlist = (id) => {
    this.props.onDeleteFromWishlist(id);
  };


  render() {
    return (
      <View style={styles.movieContainer}>
        <TouchableOpacity style={styles.favoriteButtonWrapper}>
          <Icon.Button
            name="heart"
            onPress={this.showModal}
            size={30}
            backgroundColor="transparent"
            color="red">
            <Text style={styles.favoriteNumberText}>{this.props.wishlist.length}</Text>
          </Icon.Button>
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.movieDetails}>
            <View style={styles.movieHeadline}>
              <Text style={[styles.movieText, styles.movieTitle]}>{this.props.route.params.title}</Text>
              <Text style={styles.movieText}>{this.props.route.params.rating}</Text>
            </View>

            <View>
              <Image style={styles.moviePoster}
                     source={{ uri: "https://image.tmdb.org/t/p/original" + this.props.route.params.poster_path }} />
            </View>
            <View style={styles.movieDescription}>
              <Text style={styles.movieText}>{this.props.route.params.overview}</Text>
            </View>
          </View>
        </ScrollView>


        <TouchableOpacity
          onPress={() => this.props.onAddToWishlist(this.props.route.params.title, this.props.route.params.id)} style={styles.centerButton}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add to wishlist</Text>
          </View>
        </TouchableOpacity>
        <Modal transparent={true} visible={this.state.showModal}>
          <View style={styles.outsideModalWrapper}>
            <View style={styles.insideModalWrapper}>
              <Icon.Button name="remove" onPress={this.closeModal} size={20} backgroundColor="orange" color="black"
                           style={styles.wishlistHeadline}>
                <Text>My Wishlist</Text>
              </Icon.Button>
              <View>
                {this.props.wishlist.map((item) =>
                  <View key={item.id} style={styles.wishlistItemWrapper}>
                    <View style={styles.wishlistItemContent}
                          key={item.id}>
                      <Text style={styles.wishlistItemTitle}>{item.movieTitle}</Text>
                      <Icon.Button name="remove" onPress={() => this.deleteItemFromWishlist(item.id)}>
                        remove from wishlist
                      </Icon.Button>
                    </View>
                    <View style={styles.wishlistItemSeparator} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wishlist: state.movies.wishlist,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddToWishlist: (title, id) => dispatch(actions.addToWishlist(title, id)),
    onDeleteFromWishlist: (id) => dispatch(actions.deleteFromWishlist(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Movie);

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
