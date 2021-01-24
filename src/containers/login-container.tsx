import React, {useState} from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, Animated} from 'react-native';
import FacebookLogin from "../components/fb-login";
import { GoogleSignin } from '@react-native-community/google-signin';
import GoogleLogin from "../components/google-login";
import auth from "@react-native-firebase/auth";

// import SocialLogIn from '../components/socialLogin';
interface State {
  orientation: string,
  animation: Animated.Value,
  user: any,
  initializing: boolean
}

type AllProps = {};

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
      initializing: true
    };

    this.animateOpacity();

    // GoogleSignin.configure({
    //   webClientId: "1016131625363-6gmcienql5v5aetmf0ov9rtjje9mq1lb.apps.googleusercontent.com",
    // });

    Dimensions.addEventListener('change', () => {
      console.log('orientation move');
      this.setState({
        orientation: isPortrait(),
      });
      console.log(isPortrait());
    });

    // const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
    // return subscriber; // unsubscribe on unmount
    const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
    console.log('was called');
    // unsubscribe on unmount
  }

  componentWillUnmount() {

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
    if (this.state.initializing) this.setState({initializing: false})
  };

  // socialLogin = (email) => {
  //   this.props.setIsLoggedIn(true);
  //   this.props.getEmployees();
  //   this.props.checkIfAdmin(email);
  // };

  render() {
    const animatedStyles = {
      opacity: this.state.animation
    };

    const containerBody = this.state.initializing ? null : <View style={styles.loginContainerPortrait}>
        <Animated.View style={[styles.socialLoginWrapper, animatedStyles]}>
          <View style={styles.socialButtonWrapper}>
            <FacebookLogin user={this.state.user}/>
            <GoogleLogin user={this.state.user}/>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={styles.line}/>
            <View style={styles.socialAlternativeTextWrapper}>
              <Text style={styles.socialAlternativeText}>Or</Text>
            </View>
            <View style={styles.line}/>
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

// const mapStateToProps = (state: any) => {
//   return {
//     employeesData: state.employees.employeesData,
//     loginMode: state.login.loginMode,
//     isLoggedIn: state.login.isLoggedIn,
//   };
// };
//
// const mapDispatchToProps = (dispatch: any) => {
//   return {
//     onRegisterEmployee: (first_name, last_name, email) => dispatch(actions.registerEmployee(first_name, last_name, email)),
//     getEmployees: () => dispatch(actions.getEmployees()),
//     checkIfAdmin: (email) => dispatch(actions.checkIfAdmin(email)),
//     setLoginMode: (loginMode) => dispatch(actions.setLoginMode(loginMode)),
//     setIsLoggedIn: (isLoggedIn) => dispatch(actions.setIsLoggedIn(isLoggedIn)),
//   };
// };

const styles = StyleSheet.create({
  loginContainerPortrait: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  centerAndSpaceText: {
    textAlign: 'center',
    paddingVertical: 10,
  },
  socialLoginWrapper: {
    marginBottom: 35,
    alignItems: "center",
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
    alignSelf: "stretch"
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
