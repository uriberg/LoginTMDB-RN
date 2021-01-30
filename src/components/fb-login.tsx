import React from 'react';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken} from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/FontAwesome';

interface facebookLoginProps {
  showProfileImage: () => void
}

const FacebookLogin = (props: facebookLoginProps) => {

    return (
      <Icon.Button
        name="facebook"
        backgroundColor="#3b5998"
        onPress={() => onFacebookButtonPress().then(props.showProfileImage)}>
          Login with Facebook
      </Icon.Button>
    );
};

async function onFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  // Attempt login with permissions
}

export default FacebookLogin;
