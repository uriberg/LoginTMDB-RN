import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin} from '@react-native-community/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';

const GoogleLogin = () => {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1016131625363-6gmcienql5v5aetmf0ov9rtjje9mq1lb.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      // await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
     return auth().signInWithCredential(googleCredential);
    }
    catch (error) {
      console.log(error);
    }
  }

    return (
      <Icon.Button
        name="google"
        backgroundColor="#DD4839"
        onPress={() => onGoogleButtonPress()}>
        Or with Google
      </Icon.Button>
    );

};

export default GoogleLogin;
