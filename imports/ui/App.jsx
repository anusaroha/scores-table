import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Scores } from '../api/scores.js';

import Score from './Score.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

  // Find the text field via the React ref
  const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

  Scores.insert({
    text,
    createdAt: new Date(), // current time
    owner: Meteor.userId(),           // _id of logged in user
    username: Meteor.user().username,  // username of logged in user
  });

  // Clear form
  ReactDOM.findDOMNode(this.refs.textInput).value = '';
}

toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderScores() {
    let filteredScores = this.props.scores;
    if (this.state.hideCompleted) {
      filteredScores = filteredScores.filter(score => !score.checked);
    }
    return filteredScores.map((score) => (
      <Score key={score._id} score={score} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Scores ({this.props.incompleteCount})</h1>



           <AccountsUIWrapper />

           { this.props.currentUser ?
             <form className="new-score" onSubmit={this.handleSubmit.bind(this)} >
               <input
                 type="text"
                 ref="textInput"
                 placeholder="Type to add new scores"
               />
             </form> : ''
           }
         </header>

        <ul>
          {this.renderScores()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  scores: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    scores: Scores.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Scores.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
