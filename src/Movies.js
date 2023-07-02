import React from "react";

class Movies extends React.Component {
    render() {
        return (
            <div id="movie_container">
            {this.props.movieData.map((film, index) => {
                return <div key={index}>
                    <h3 className="film_title">{film.title}</h3>
                    <img src={`https://image.tmdb.org/t/p/w92/${film.poster}`} alt={`Movie poster of ${film.title}`} />
                    {film.voteRating > 0 && <p>Rating: {film.voteRating}</p>}
                    <p>{film.description}</p>
                </div>
            })}
            </div>
        )
    }
}

export default Movies;