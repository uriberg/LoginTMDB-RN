import React, {useState} from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, Animated, Image, Button} from 'react-native';
import FacebookLogin from "../components/fb-login";
import {GoogleSignin} from '@react-native-community/google-signin';
import GoogleLogin from "../components/google-login";
import auth from "@react-native-firebase/auth";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationScreenProps} from "react-navigation";
//import emptyProfile from './assets/images/emptyProfile.png';
//const emptyProfileUri = Image.resolveAssetSource(emptyProfile).uri;
const emptyProfile = require('../assets/images/emptyProfile.png');
import {
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk';

// import SocialLogIn from '../components/socialLogin';
interface State {
    orientation: string,
    animation: Animated.Value,
    user: any,
    initializing: boolean,
    pictureURL: any,
    pictureURLByID: any
}

interface extendedProps extends NavigationScreenProps {

}

type AllProps = NavigationScreenProps;

let subscriber;
class LoginContainer extends React.Component<AllProps, State> {


    constructor(props: AllProps) {
        super(props);

        const isPortrait = () => {
            const dim = Dimensions.get('window');
            return dim.height >= dim.width ? 'portrait' : 'landscape';
        };

        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape',
            animation: new Animated.Value(0),
            user: undefined,
            initializing: true,
            pictureURL: null,
            pictureURLByID: null
        };

        this.animateOpacity();

        Dimensions.addEventListener('change', () => {
            console.log('orientation move');
            this.setState({
                orientation: isPortrait(),
            });
            console.log(isPortrait());
        });

        // const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
        // return subscriber; // unsubscribe on unmount
        subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
        console.log('was called');
        // unsubscribe on unmount
    }



    componentWillUnmount = () => {
        subscriber();
    }

    animateOpacity = () => {
        Animated.timing(this.state.animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    };

    onAuthStateChanged = (user: any) => {
        console.log('this is user');

        this.setState({user: user})
        console.log(user);
        console.log(user?.photoURL);
        if (this.state.initializing) this.setState({initializing: false})
    };

    onFacebookLoginImage = () => {
        const infoRequest = new GraphRequest(
            '/me?fields=picture',
            null,
            (error, result) => {
                if (error) {
                    console.log('Error fetching data: ' + JSON.stringify(error));
                } else {
                    console.log(JSON.stringify(result, null, 2));
                    this.setState({
                        pictureURL: result?.picture.data.url,
                        pictureURLByID: `https://graph.facebook.com/${result?.id}/picture`
                    });
                }
            },
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    };

    render() {
        const animatedStyles = {
            opacity: this.state.animation
        };

        const containerBody = this.state.initializing ? null
            :
            <View style={styles.loginContainerPortrait}>
                <View style={{
                    marginBottom: "auto",
                    marginTop: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 50
                }}>
                    {this.state.user?
                        <Text style={{fontWeight: "bold", fontSize: 19}}>Welcome {this.state.user.displayName}!</Text>
                        :
                        <Text style={{fontWeight: "bold", fontSize: 19}}>Welcome Stranger!</Text>
                    }
                    {!this.state.user ?
                        <Image source={emptyProfile} style={{width: 70, height: 70, marginVertical: 20}}/>
                        :
                        <Image source={{uri: this.state.user.photoURL}}
                               style={{width: 70, height: 70, marginVertical: 20, borderRadius: 35}}/>
                    }
                  {/*{this.state.pictureURL && (*/}
                  {/*    <Image style={{width: 70, height: 70, marginVertical: 20}} source={{uri: this.state.pictureURL}} />*/}
                  {/*)}*/}
                  {/*{this.state.pictureURLByID && (*/}
                  {/*    <Image style={{width: 70, height: 70, marginVertical: 20}} source={{uri: this.state.pictureURLByID}} />*/}
                  {/*)}*/}
                    {this.state.user?
                        <Button
                            title="Go to movies"
                            onPress={() => this.props.navigation.navigate('Movies')}
                        />
                        :
                        <Text style={{textAlign: "center", width: 150, fontSize: 13}}>Please log in to continue to the
                            awesomness</Text>
                    }
                </View>

                <Animated.View style={[styles.socialLoginWrapper, animatedStyles]}>
                    <View style={styles.socialButtonWrapper}>
                        <FacebookLogin user={this.state.user} showProfileImage={this.onFacebookLoginImage}/>
                        <GoogleLogin user={this.state.user}/>
                    </View>
                </Animated.View>
            </View>;

        if (this.state.orientation === 'landscape') {
            return (
                <ScrollView>
                    {containerBody}
                </ScrollView>
            );
        } else {
            return (
                <>
                    {containerBody}
                </>
            );
        }
    }
}

const styles = StyleSheet.create({
    loginContainerPortrait: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        // flexDirection: 'row'
        backgroundColor: "#f8f8ff",
    },
    centerAndSpaceText: {
        textAlign: 'center',
        paddingVertical: 10,
    },
    socialLoginWrapper: {

        paddingVertical: 20,
        flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "flex-end"
    },
    footer: {
        paddingHorizontal: 5,
        marginTop: 120,
        borderRadius: 5,
        backgroundColor: "#036f79",
    },
    footerText: {
        color: "#bdcddc",
        fontWeight: "bold",
        fontSize: 16
    },
    socialButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
        // backgroundColor: 'blue'
    },
    socialAlternativeTextWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#036f79"
    },
    socialAlternativeText: {
        color: "#bdcddc",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 2
    },
    line: {
        backgroundColor: "#96a4b1",
        height: 2,
        flex: 1,
        alignSelf: 'center',
        marginTop: 5
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
});


export default LoginContainer;
