import React from 'react';
import axios from 'axios';
import './App.css';
import Image from 'react-bootstrap/Image';
import Weather from './Weather';
import Movies from './Movies';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: '',
      lat: '',
      lon: '',
      locationData: [],
      mapData: '',
      error: false,
      errorMsg: '',
      mapImageUrl: '',
      forecastData: [],
      movieData: [],
    }
  }

  handleGetCityInput = (event) => {
    this.setState({
      city: event.target.value
    })
  }

  handleGetCityInfo = async (event) => {
    event.preventDefault();

    try {
      let url = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_API}&q=${this.state.city.toLowerCase()}&format=json`;
      let axiosCityData = await axios.get(url);

      this.setState({
        locationData: axiosCityData.data[0],
        latitude: axiosCityData[0].lat,
        longitude: axiosCityData[0].lon,
        display_name: axiosCityData[0].display_name,
        mapImageUrl: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_API}&center=${axiosCityData.data[0].lat},${axiosCityData.data[0].lon}&zoom=12&size=<width>x<height>&format=<format>&maptype=<MapType>&markers=icon:<icon>|<latitude>,<longitude>&markers=icon:<icon>|<latitude>,<longitude>`,
        error: false,
        errorMsg: ''
      })

      this.handGetWeatherInfo(axiosCityData.data[0].lat, axiosCityData.data[0].lon)
      this.handleGetMovieInfo(this.state.city);

      let movieURL = `${process.env.REACT_APP_SERVER}/movies?searchQuery=${this.state.city}`

      let movieDataFromAxios = await axios.get(movieURL);

      this.setState({
        movieData: movieDataFromAxios.data

      })

    } catch (error) {
      this.setState({
        error: true,
        errorMsg: 'Error fetching data, ' + error.message,
      });
    }
  }

  handleCityMap = async (lat, lon) => {

    let url = `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_API}&center=${lat},${lon}&zoom=1-18`
    let axiosMapData = await axios.get(url);
    console.log(axiosMapData);

    this.setState({
      mapData: axiosMapData.data
    })
  }


  getWeather = async (lat, lon) => {
    try {
      let weatherUrl = `${process.env.REACT_APP_SERVER}/weather?lat=${lat}&lon=${lon}&searchQuery=${this.state.city}`;
      let weatherAxiosData = await axios.get(weatherUrl);
      let weatherData = weatherAxiosData.data;

      this.setState({
        weatherData,
      })
    } catch (error) {

      this.setState({
        error: true,
        errorMsg: 'Error fetching data, ' + error.message,
      })
    }
  }

  render() {
    return (
      <div className='app-cont'>
        <h1 className='text-shadow'>City Explorer</h1>
        <form onSubmit={this.handleGetCityInfo} className='form-cont'>
          <label htmlFor='' className='text-shadow'> Enter City Name
            <input type='text' onChange={this.handleGetCityInput} className='text-input' />
          </label>
          <button type='submit' className='sub-btn'>Explore!</button>
        </form>

        {
          this.state.error
            ? <p className='err-msg'>{this.state.errorMsg}</p>
            : (
              <div className='content'>
                <p className='text-shadow'>{this.state.locationData.display_name}</p>
                <p className='text-shadow'>Latitude: {this.state.locationData.latitude}</p>
                <p className='text-shadow'>Longitude: {this.state.locationData.longitude}</p>

                <Image className='map' src={this.state.mapImageUrl} />

                {this.state.forecastData.length > 0 && <Weather forecastData={this.state.forecastData} />}
                {this.state.movieData.length > 0 && <Movies movieData={this.state.movieData} />}

              </div>
            )
        }
        <footer className='footer text-shadow'>Author: ChristianRhey Tojot</footer>
      </div>
    )
  }
};


export default App;