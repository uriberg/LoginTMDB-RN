/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import LoginContainer from './src/containers/login-container';
import MoviesContainer from './src/containers/movies-container';
import Movie from './src/containers/movie';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'mobx-react';
import MoviesStore from "./src/store/movies-store";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={MoviesStore}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={LoginContainer} />
          <Stack.Screen name="Movies" component={MoviesContainer} />
          <Stack.Screen name="Movie" component={Movie} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
