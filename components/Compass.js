import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Animated, Easing, Dimensions} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

export default class Compass extends Component {
  constructor() {
    super()
    this.spinValue = new Animated.Value(0);
    this.state =  {
        location: null,
        errorMessage: null,
        heading: null
      };
  }

  componentWillMount() {
      this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    // Checking device location permissions
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    else
    {
      Expo.Location.watchHeadingAsync((obj) => {
        let heading = obj.magHeading;
        this.setState({heading: heading})
      })
    }
  };


  spin() {
    let start = JSON.stringify(this.spinValue);
    let end =  this.state.heading;

    // Handling angle jumps between 0 and 360
    if((end%360-start%360) > 180) {
      end = end - 360;
    }
    if((end%360-start%360)%360 < -180) {
      end = end + 360;
    }

    Animated.timing(
      this.spinValue,
      {
        toValue: end,
        duration: 300,
        easing: Easing.easeInOutQuart
      }
    ).start()
  }

  componentWillUpdate() {
    this.spin()
  }

  render() {
    let LoadingText = 'Loading...';
    let degree = LoadingText;

    if (this.state.errorMessage)
      degree = this.state.errorMessage;

    const spin = this.spinValue.interpolate({
      inputRange: [0,360],
      outputRange: ['-0deg', '-360deg']
    })

    degree = Math.round(JSON.stringify(this.spinValue))
    if(degree < 0)
      degree += 360

    return (
      <View style={styles.container}>
      <Text style={styles.text}>{degree}</Text>
          <View style={styles.imageContainer} >
            <Animated.Image resizeMode='contain' source={require('../assets/compass.png')}
              style={{
              width:  deviceWidth  - 10, height: deviceHeight/2 - 10,
              left: deviceWidth /2 -  (deviceWidth   - 10)/2, top:  deviceHeight /2 - (deviceHeight/2  - 10)/2,
              transform: [{rotate: spin}],
            }} />
          </View>
          <View style={styles.arrowContainer} >
            <Image resizeMode='contain' source={require('../assets/arrow.png')} style={styles.arrow} />
          </View>
      </View>
    );
  }
}

// Device dimensions so we can properly center the images set to 'position: absolute'
const deviceWidth  =  Dimensions.get('window').width
const deviceHeight =  Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#263544',
    fontSize: 80,
    transform: ([{translateY: -(deviceHeight/2 - (deviceHeight/2  - 10)/2) - 50 }])
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  arrowContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  arrow: {
    width: deviceWidth/7,
    height: deviceWidth/7,
    left: deviceWidth /2 - (deviceWidth/7)/2,
    top:  deviceHeight /2  - (deviceWidth/7)/2,
    opacity: 0.9
  }

});
