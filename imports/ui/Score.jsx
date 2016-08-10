import React, { Component, PropTypes } from 'react';

import { Scores } from '../api/scores.js';

// Score component - represents a single todo item
export default class Score extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Scores.update(this.props.score._id, {
      $set: { checked: !this.props.score.checked },
    });
  }

  deleteThisScore() {
    Scores.remove(this.props.score._id);
  }

  render() {
    // Give scores a different className when they are checked off,
    // so that we can style them nicely in CSS
    const scoreClassName = this.props.score.checked ? 'checked' : '';

    return (
      <li className={scoreClassName}>
  

        <span className="text">
        <strong>{this.props.score.username}</strong>: {this.props.score.text}
        </span>
      </li>
    );
  }
}

Score.propTypes = {
  // This component gets the score to display through a React prop.
  // We can use propTypes to indicate it is required
  score: PropTypes.object.isRequired,
};
