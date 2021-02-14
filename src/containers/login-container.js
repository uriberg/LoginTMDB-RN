import React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
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
        };

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

    componentWillUnmount = () => {
        subscriber();
    }

    onAuthStateChanged = (user) => {
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
        const containerBody = this.state.initializing ? null
            :
            <View style={styles.loginContainerPortrait}>
                <View style={styles.loginWelcome}>
                    {this.state.user ?
                        <Text style={styles.loginWelcomeText}>Welcome {this.state.user.displayName}!</Text>
                        :
                        <Text style={styles.loginWelcomeText}>Welcome Stranger!</Text>
                    }
                    {!this.state.user ?
                        <Image source={emptyProfile} style={styles.emptyAvatar}/>
                        :
                        <Image source={{uri: this.state.user.photoURL}}
                               style={styles.profileAvatar}/>
                    }
                    {this.state.user ?
                        <TouchableOpacity style={styles.loginGoToMoviesButton} onPress={() => this.props.navigation.navigate('Movies')}>
                            <Text style={styles.loginGoToMoviesButtonText}>GO TO MOVIES</Text>
                        </TouchableOpacity>
                        :
                        <Text style={styles.loginWelcomeSubHeading}>Please log in to continue to the
                            awesomness</Text>
                    }
                </View>

                {!this.state.user ?
                  <View style={[styles.socialLoginWrapper]}>
                      <View style={styles.socialButtonWrapper}>
                              <FacebookLogin user={this.state.user} showProfileImage={this.onFacebookLoginImage} />
                              <GoogleLogin user={this.state.user} />
                      </View>

                  </View> :


                  <TouchableOpacity onPress={this.logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Logout</Text>
                  </TouchableOpacity>

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
