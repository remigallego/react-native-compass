import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Animated, Easing } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import Compass from './components/Compass.js'

export default class App extends Component {
state = {
  fadeAnim: new Animated.Value(0)
}

componentDidMount() {

  // Fade in on app launch
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 1200,
      }
    ).start();
  } 

  render() {
    return (
      <Animated.View style={
          {flex: 1,
        backgroundColor: "#ecedef",
        opacity: this.state.fadeAnim
        }
      } >
        <Compass />
      </Animated.View>
    );
  }
}
