import React from "react";

class WeatherDay extends React.Component {
    render() {
        return (
            <div id="weatherContainer">
                {this.props.forecast.map((day, index) => {
                return <div key={index} className="weatherDay">
                <img src={require(`./icons/${day.icon}.png`)} alt={`An icon representing that the day was ${day.description}`} />
                <p>Date: {day.date}</p>
                <p>Description: {day.description}</p>
                </div>
                })}
            </div>
        )
    }
}

export default WeatherDay;