import React, {useState} from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, Animated, Image} from 'react-native';

type AllProps = {};

class MoviesContainer extends React.Component<AllProps> {

    constructor(props: AllProps) {
        super(props);

        const isPortrait = () => {
            const dim = Dimensions.get('window');
            return dim.height >= dim.width ? 'portrait' : 'landscape';
        };

    }

    render() {
        return (
            <Text>
                Movies Container
            </Text>
        );
    }
}

export default MoviesContainer;
