import React from "react";
import WeatherDay from './WeatherDay';

class Weather extends React.Component {
  render() {
    return (
      <>
        <h1>Weather Forecast</h1>
        {this.props.forecastData.map((day, index) => {
              return<WeatherDay day={day} key={index}></WeatherDay>                          
          })};
      </>
    )
  }
}

export default Weather;