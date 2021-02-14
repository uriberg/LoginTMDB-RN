import React from "react";
import {View, StyleSheet, Animated, Text} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class WishlistItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wishlistItem: new Animated.Value(0),
        };
    }

    componentDidMount() {
        Animated.timing(this.state.wishlistItem, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    }

    onRemove = () => {
        Animated.timing(this.state.wishlistItem, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true
        }).start(() => this.props.deleteItemFromWishlist(this.props.id));
    };

    render() {
        const animatedStyles = {
            opacity: this.state.wishlistItem
        };

        return (
            <Animated.View style={[styles.wishlistItemWrapper, animatedStyles]}>
                <View style={styles.wishlistItemContent}
                      key={this.props.id}>
                    <Text style={styles.wishlistItemTitle}>{this.props.movieTitle}</Text>
                    <Icon.Button name="remove" onPress={this.onRemove}>
                        remove from wishlist
                    </Icon.Button>
                </View>
                <View style={styles.wishlistItemSeparator} />
            </Animated.View>
        );
    }
}


export default WishlistItem;

const styles = StyleSheet.create({
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
});
