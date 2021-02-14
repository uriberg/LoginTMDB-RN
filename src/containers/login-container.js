import React from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Animated} from 'react-native';
import FacebookLogin from '../components/fb-login';
import GoogleLogin from '../components/google-login';
import auth from '@react-native-firebase/auth';
// import {NavigationScreenProps} from 'react-navigation';
const emptyProfile = require('../assets/images/emptyProfile.png');
import {
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk';

// interface State {
//     orientation: string,
//     user: any,
//     initializing: boolean,
//     pictureURL: any,
//     pictureURLByID: any
// }

// type AllProps = NavigationScreenProps;

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
const AnimatedImage = Animated.createAnimatedComponent(Image);

let subscriber;

class LoginContainer extends React.Component {

    constructor(props) {
        super(props);

        const isPortrait = () => {
            const dim = Dimensions.get('window');
            return dim.height >= dim.width ? 'portrait' : 'landscape';
        };

        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape',
            user: undefined,
            initializing: true,
            pictureURL: null,
            pictureURLByID: null,
            animation: new Animated.Value(0),
            logout: new Animated.Value(0),
            welcome: new Animated.Value(0),
            profileImage: new Animated.Value(0),
            loginToContinue: new Animated.Value(0),
            welcomeUser: new Animated.Value(0),
            socialProfileImage: new Animated.Value(0),
            goToMovies: new Animated.Value(0)
        };

        this.animateOpacity();

        Dimensions.addEventListener('change', () => {
            console.log('orientation move');
            this.setState({
                orientation: isPortrait(),
            });
            console.log(isPortrait());
        });

        // return subscriber; // unsubscribe on unmount
        subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
        // unsubscribe on unmount
    }

    componentDidMount() {
       this.animateStagger();
    }


    componentWillUnmount = () => {
        subscriber();
    };

    animateStagger = () => {
        Animated.stagger(200, [
            Animated.timing(this.state.welcome, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(this.state.profileImage, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(this.state.loginToContinue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
        ]).start();
    };

    animateLoggedIn = () => {
        Animated.stagger(200, [
            Animated.timing(this.state.welcomeUser, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(this.state.socialProfileImage, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(this.state.goToMovies, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
        ]).start();
    }

    animateOpacity = () => {
        Animated.timing(this.state.animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    };

    animateLogout = () => {
        Animated.timing(this.state.logout, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    };

    onAuthStateChanged = (user) => {
        if (user) {
            this.state.animation.setValue(0);
            this.state.welcome.setValue(0);
            this.state.profileImage.setValue(0);
            this.state.loginToContinue.setValue(0);
            this.animateLogout();
            this.animateLoggedIn();
        } else {
            this.state.logout.setValue(0),
            this.state.welcomeUser.setValue(0),
            this.state.socialProfileImage.setValue(0),
            this.state.goToMovies.setValue(0),
            this.animateOpacity();
            this.animateStagger();
        }
        this.setState({user: user});
        if (this.state.initializing) this.setState({initializing: false});
    };

    logout = () => {
        try {
            auth()
                .signOut()
                .then(() => {
                    this.setState({user: null});
                });
        } catch (error) {
            console.error(error);
        }
    };

    onFacebookLoginImage = () => {
        const infoRequest = new GraphRequest(
            '/me?fields=picture',
            null,
            (error, result) => {
                if (error) {
                    console.log('Error fetching data: ' + JSON.stringify(error));
                } else {
                    // console.log(JSON.stringify(result, null, 2));
                    this.setState({
                        pictureURL: result?.picture.data.url,
                        pictureURLByID: `https://graph.facebook.com/${result?.id}/picture`,
                    });
                }
            },
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    };

    render() {
        const welcomeStyle = createAnimationStyle(this.state.welcome);
        const welcomeUserStyle = createAnimationStyle(this.state.welcomeUser);
        const profileImageStyle = createAnimationStyle(this.state.profileImage);
        const socialProfileImageStyle = createAnimationStyle(this.state.socialProfileImage);
        const loginToContinueStyle = createAnimationStyle(this.state.loginToContinue);
        const goToMoviesStyle = createAnimationStyle(this.state.goToMovies);


        const animatedStyles = {
            opacity: this.state.animation
        };

        const animatedLogout = {
            opacity: this.state.logout
        };

        const containerBody = this.state.initializing ? null
            :
            <View style={styles.loginContainerPortrait}>
                <View style={styles.loginWelcome}>
                    {this.state.user ?
                        <Animated.View style={welcomeUserStyle}>
                            <Text style={styles.loginWelcomeText}>Welcome {this.state.user.displayName}!</Text>
                        </Animated.View>
                        :
                        <Animated.View style={welcomeStyle}>
                            <Text style={styles.loginWelcomeText}>Welcome Stranger!</Text>
                        </Animated.View>
                    }
                    {!this.state.user ?
                        <Animated.View style={profileImageStyle}>
                            <Image source={emptyProfile} style={styles.emptyAvatar}/>
                        </Animated.View>
                        :
                        <AnimatedImage source={{uri: this.state.user.photoURL}}
                               style={[styles.profileAvatar, socialProfileImageStyle]}/>
                    }
                    {this.state.user ?
                        <AnimatedTouchable style={[styles.loginGoToMoviesButton, goToMoviesStyle]}
                                          onPress={() => this.props.navigation.navigate('Movies')}>
                            <Text style={styles.loginGoToMoviesButtonText}>GO TO MOVIES</Text>
                        </AnimatedTouchable>
                        :
                        <Animated.View style={loginToContinueStyle}>
                            <Text style={styles.loginWelcomeSubHeading}>Please  log in to continue to the
                                awesomness</Text>
                        </Animated.View>
                    }
                </View>

                {!this.state.user ?
                    <Animated.View style={[styles.socialLoginWrapper, animatedStyles]}>
                        <View style={styles.socialButtonWrapper}>
                            <FacebookLogin user={this.state.user} showProfileImage={this.onFacebookLoginImage}/>
                            <GoogleLogin user={this.state.user}/>
                        </View>

                    </Animated.View> :

                    <AnimatedTouchable onPress={this.logout} style={[styles.logoutButton, animatedLogout]}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </AnimatedTouchable>

                }
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
        backgroundColor: '#f8f8ff',
    },
    loginWelcome: {
        marginBottom: 'auto',
        marginTop: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50,
    },
    loginWelcomeText: {
        fontWeight: 'bold', fontSize: 19,
    },
    emptyAvatar: {
        width: 70, height: 70, marginVertical: 20,
    },
    profileAvatar: {
        width: 70, height: 70, marginVertical: 20, borderRadius: 35,
    },
    loginGoToMoviesButton: {
        backgroundColor: 'orange', padding: 10, borderRadius: 10,
    },
    loginGoToMoviesButtonText: {
        textAlign: 'center', color: 'white',
    },
    loginWelcomeSubHeading: {
        textAlign: 'center', width: 150, fontSize: 13,
    },
    socialLoginWrapper: {
        paddingVertical: 20,
        flexDirection: 'row',
        // alignItems: "center",
        // justifyContent: "flex-end"
    },
    logoutButton: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 20,
    },
    logoutButtonText: {
        textAlign: 'center', color: 'white',
    },
    socialButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
    },
});


export default LoginContainer;
