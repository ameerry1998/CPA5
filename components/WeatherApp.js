import React, {useEffect} from 'react';
import {StyleSheet, View, ImageBackground, Text, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar, TextInput} from 'react-native';

import { fetchLocationId, fetchWeather } from '../utils/api';
import getImageForWeather from '../utils/getImageForWeather';

import SearchInput from './SearchInput';

export default class WeatherApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, error: false, location: '', temperature: 0, weather: '', text: '',};

  }

  componentDidMount() {
    this.handleUpdateLocation('San Francisco');
  }


  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(
          locationId,
        );

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
        });
      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  render() {
    const { loading, error, location, weather, temperature, } = this.state;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="height"
      >
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.largeText, styles.textStyle]}>
                    Weather not avilable for this city please try a different one
                  </Text>
                )}

                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}> {location} </Text>
                    <Text style={[styles.smallText, styles.textStyle]}> {weather} </Text>
                    <Text style={[styles.largeText, styles.textStyle]}> {`${Math.round(temperature)}°`} </Text>
                  </View>
                )}

                <SearchInput
                  placeholder="Search any city"
                  onSubmit={this.handleUpdateLocation}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  Inputcontainer: {
    height: 40,
    marginTop: 20,
    backgroundColor: '#666',
    marginHorizontal: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    color: 'white',
  },
});


