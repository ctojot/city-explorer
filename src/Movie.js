import React from "react";
import Movies from './Movies'


class Movie extends React.Component {

  render() {
    return (
      <>
      <h1>Movies</h1>
        {this.props.movies.map((movie, index) => (
          <Movies movie={movie} key={index}/>
        ))}
      </>
    )
  }
}

export default Movie;