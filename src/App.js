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
      const cityQuery = this.state.city.trim();
      if (!cityQuery) {
        throw new Error('Please enter a city name.');
      }

      let url = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_API}&q=${encodeURIComponent(cityQuery)}&format=json`;
      let axiosCityData = await axios.get(url);

      if (!axiosCityData.data || axiosCityData.data.length === 0) {
        throw new Error(`No location found for ${cityQuery}`);
      }

      const location = axiosCityData.data[0];
      const latitude = location.lat;
      const longitude = location.lon;

      this.setState({
        locationData: location,
        lat: latitude,
        lon: longitude,
        display_name: location.display_name,
        mapImageUrl: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_API}&center=${latitude},${longitude}&zoom=12&size=600x400&format=png&maptype=roadmap&markers=icon:large-red-cutout|${latitude},${longitude}`,
        error: false,
        errorMsg: ''
      });

      await this.getWeather(latitude, longitude);
      const movieData = await this.getMovieData(cityQuery);

      this.setState({
        movieData
      });
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
      const server = process.env.REACT_APP_SERVER;
      let weatherData;

      if (server) {
        let weatherURL = `${server}/weather?lat=${lat}&lon=${lon}&searchQuery=${this.state.city}`;
        let weatherAxiosData = await axios.get(weatherURL);
        weatherData = weatherAxiosData.data;
      } else {
        const weatherApiKey = process.env.REACT_APP_WEATHER_API || process.env.REACT_WEATHER_API;
        if (!weatherApiKey) {
          throw new Error('Weather API key is missing. Set REACT_APP_WEATHER_API in your environment.');
        }

        let weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${weatherApiKey}`;
        let weatherAxiosData = await axios.get(weatherURL);

        weatherData = weatherAxiosData.data.daily.map(day => ({
          date: new Date(day.dt * 1000).toLocaleDateString(),
          description: day.weather?.[0]?.description || ''
        })).slice(0, 5);
      }

      this.setState({
        forecastData: weatherData,
      });
    } catch (error) {
      this.setState({
        error: true,
        errorMsg: 'Error fetching data, ' + error.message,
      });
    }
  }

  getMovieData = async (searchQuery) => {
    try {
      const server = process.env.REACT_APP_SERVER;
      if (server) {
        let movieURL = `${server}/movies?searchQuery=${encodeURIComponent(searchQuery)}`;
        let movieDataFromAxios = await axios.get(movieURL);
        return movieDataFromAxios.data;
      }

      const movieApiKey = process.env.REACT_APP_MOVIE_API || process.env.REACT_MOVIE_API;
      if (!movieApiKey) {
        throw new Error('Movie API key is missing. Set REACT_APP_MOVIE_API in your environment.');
      }

      let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`;
      let movieAxiosData = await axios.get(movieURL);

      return movieAxiosData.data.results.map(film => ({
        title: film.title,
        poster: film.poster_path || '',
        voteRating: film.vote_average,
        description: film.overview,
      }));
    } catch (error) {
      throw error;
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
                <p className='text-shadow'>Latitude: {this.state.locationData.lat}</p>
                <p className='text-shadow'>Longitude: {this.state.locationData.lon}</p>

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