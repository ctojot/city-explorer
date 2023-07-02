import React from "react";

class WeatherDay extends React.Component {
  render() {
    return (
      <div key={this.props.index}>
        <p>Date: {this.props.day.date}</p>
        <p>Weather: {this.props.day.description}</p>
      </div>
    )
  }
}

export default WeatherDay;