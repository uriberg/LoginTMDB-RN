import React from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/FontAwesome';

interface facebookLoginProps {
  user: any,
  showProfileImage: () => void
}

const FacebookLogin = (props: facebookLoginProps) => {
  if (!props.user) {
    return (
      <Icon.Button
        name="facebook"
        backgroundColor="#3b5998"
        onPress={() => onFacebookButtonPress().then(props.showProfileImage)}>
          Login with Facebook
      </Icon.Button>
    );
  };

  return (
    <Icon.Button
      name="facebook"
      backgroundColor="#3b5998"
      onPress={() => onFacebookSignOut().then(() => console.log('Signed out with Facebook!'))}>
        Facebook Sign-Out
    </Icon.Button>
  );
};

async function onFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    console.log(result);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    console.log(data);
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    console.log(facebookCredential);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  // Attempt login with permissions
}

async function onFacebookSignOut(){
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

export default FacebookLogin;
