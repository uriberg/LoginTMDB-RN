import React, {useState, useEffect} from 'react';
import { Button, Alert, Text } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes} from '@react-native-community/google-signin';

interface googleLoginProps {
  user: any
}

const GoogleLogin = (props: googleLoginProps) => {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "1016131625363-6gmcienql5v5aetmf0ov9rtjje9mq1lb.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);


  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // const onAuthStateChanged = (userState: any) => {
  //   setUser(userState);
  //   if (initializing) setInitializing(false);
  // };

  // useEffect(() => {
  //   // Initial configuration
  //   GoogleSignin.configure({
  //     // Mandatory method to call before calling signIn()
  //     scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  //     // Repleace with your webClientId
  //     // Generated from Firebase console
  //     webClientId: '1016131625363-6gmcienql5v5aetmf0ov9rtjje9mq1lb.apps.googleusercontent.com',
  //   });
  //   // Check if user is already signed in
  //   _isSignedIn();
  // }, []);
  //
  // const _isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   if (isSignedIn) {
  //     console.log('user is already signed in with google!!!');
  //     // Set User Info if user is already signed in
  //     _getCurrentUserInfo();
  //   } else {
  //     console.log('Please Login');
  //   }
  //   setGettingLoginStatus(false);
  // };
  //
  // const _getCurrentUserInfo = async () => {
  //   try {
  //     let info = await GoogleSignin.signInSilently();
  //     console.log('User Info --> ', info);
  //     setUserInfo(info);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  //       console.log('User has not signed in yet');
  //       console.log('User has not signed in yet');
  //     } else {
  //       console.log("Unable to get user's info");
  //       console.log("Unable to get user's info");
  //     }
  //   }
  // };

  async function onGoogleButtonPress() {
    // Get the users ID token
    try {
      // await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      // console.log(userInfo);
      //setUserInfo({userInfo});
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      //setUserInfo(idToken);
      //console.log(googleCredential);

      // console.log(userInfo.idToken);
      //setUserInfo({userInfo});
      // Sign-in the user with the credential
     return auth().signInWithCredential(googleCredential);
    }
    catch (error) {
      console.log(error);
    }
  }

  async function onGoogleSignOut(){
    try {
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => {
          console.log('User signed out!');
        });
     // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   auth().onAuthStateChanged(userState => {
  //     setUser(userState);
  //     if (initializing) setInitializing(false);
  //   });
  //   // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   // return subscriber; // unsubscribe on unmount
  // }, []);
  //
  // if (initializing) return null;

  if (!props.user) {
    return (
      <Button
        title="Google Sign-In"
        onPress={() => onGoogleButtonPress().then(() => console.log('siged in?'))}
      />
    );
  }

  return (
    <Button title="Google Sign-out" onPress={() => onGoogleSignOut().then(() => console.log('sidned out'))}/>
  );
}



export default GoogleLogin;
