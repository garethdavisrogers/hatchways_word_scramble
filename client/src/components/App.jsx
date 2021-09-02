import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";

class App extends React.Component {
  constructor() {
    super();
    this.state = { data: null, page: 2, rows: null, scrambledSentence: null };
  }
  componentDidMount() {
    const { page } = this.state;
    const fetchData = axios
      .get(`https://api.hatchways.io/assessment/sentences/${page}`)
      .then((res) => {
        const fetchedSentence = res.data.data.sentence;
        this.setState({ data: fetchedSentence });
      })
      .then(() => this.handleScrambleSentence())
      .catch((err) => {
        console.error(err);
      });
  }
  handleScrambleSentence = () => {
    const { data } = this.state;
    const wordArray = data.split(" ");
    this.setState({ wordLength: wordArray.length });
    const scrambled = wordArray.map((word) => {
      if (word.length < 3) {
        return word;
      }
      let letterArray = word.split("");
      let first = letterArray.shift();
      let last = letterArray.pop();
      letterArray.sort(() => Math.random() - 0.5);
      let middle = letterArray.join("");
      return first + middle + last;
    });
    this.setState({ scrambledSentence: scrambled.join(" ") });
  };
  render() {
    const { data, scrambledSentence } = this.state;
    return (
      <div className="container">
        <div className="page">
          <div className="text-display">
            <div className="sentence">
              {scrambledSentence
                ? scrambledSentence
                : "Fetching Hatchways API Data"}
            </div>
            <div>Guess the sentence! Starting typing</div>
            <br />
            <div>The yellow blocks are meant for spaces</div>
            <div>Score: 0</div>
          </div>
          {scrambledSentence && (
            <Table data={data} scrambledSentence={scrambledSentence} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
