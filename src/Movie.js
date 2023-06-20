import React from "react";


class Movie extends React.Component {

    render() {
        return (
            <Movie movieData={this.props.movieData} />
        )
    }
}

export default Movie;