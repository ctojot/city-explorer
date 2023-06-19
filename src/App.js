import React from 'react';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: '',
      locationData: [],
      error: false,
      errorMsg: '',
      mapImageUrl: '',
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
      let url = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_API}&q=${this.state.city}&format=json`;
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
    return (
      <>
        <h1>City Explorer</h1>
        <form onSubmit={this.handleGetCityInfo}>
          <label htmlFor=''> Enter City Name:
            <input type='text' onChange={this.handleGetCityInput} />
          </label>
          <button type='submit'>Explore!</button>
        </form>

        {
          this.state.error
            ? <p>{this.state.errorMsg}</p>
            : (
              <div className='content'>
                <p>{this.state.locationData.display_name}</p>
                <p>Latitude: {this.state.locationData.latitude}</p>
                <p>Longitude: {this.state.locationData.longitude}</p>
                {this.state.mapImageUrl && <img src={this.state.mapImageUrl} alt='City Map' />}
              </div>
            )
        }
        <footer>Author: ChristianRhey Tojot</footer>
      </>
    )
  }
};


export default App;