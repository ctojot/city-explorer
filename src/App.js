import React from 'react';
import axios from 'axios';
import './App.css';
import Image from 'react-bootstrap/Image';
import Weather from './Weather';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: '',
      locationData: [],
      error: false,
      errorMsg: '',
      mapImageUrl: '',
      weather: {date: '', description: ''},
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
      let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_API}&q=${this.state.city.toLowerCase()}&format=json`;
      let cityDataFromAxios = await axios.get(url);
      let data = cityDataFromAxios.data;

      if (data.length > 0) {
        this.setState({
          locationData: {
            latitude: data[0].lat,
            longitude: data[0].lon,
            display_name: data[0].display_name,
          },
          mapImageUrl: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_API}&center=${data[0].lat},${data[0].lon}&zoom=10`,
          error: false,
          errorMsg: ''
        })
        let weatherDataFromAxios = await axios.get(`http://localhost:3001/weather?searchQuery=${this.state.city.toLowerCase()}&lat=${data[0].lat}&lon=${data[0].lon}`)
        this.setState({
          weather: {description: weatherDataFromAxios.description, date: weatherDataFromAxios.date}
        })
      } else {
        this.setState({
          error: true,
          errorMsg: 'No Results',
          mapImageUrl: '',
        });
      }
    } catch (error) {
      this.setState({
        error: true,
        errorMsg: 'Error fetching data, ' + error.message,
        mapImageUrl: '',
      });
    }
  }

  render() {
    const isWeatherValid = (this.state.weather.date && this.state.weather.description)
    return (
      <div className='app-cont'>
        <h1 className='text-shadow'>City Explorer</h1>
        <form onSubmit={this.handleGetCityInfo} className='form-cont'>
          <label htmlFor='' className='text-shadow'> Enter City Name
            <input type='text' onChange={this.handleGetCityInput} className='text-input'/>
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
                {this.state.mapImageUrl && <Image rounded src={this.state.mapImageUrl} alt='City Map' />}
                {isWeatherValid && 
                <Weather
                  date={this.state.weather.date}
                  description={this.state.weather.description}
                />
                }
              </div>
            )
        }
        <footer className='footer text-shadow'>Author: ChristianRhey Tojot</footer>
      </div>
    )
  }
};


export default App;