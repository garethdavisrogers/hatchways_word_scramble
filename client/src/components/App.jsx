import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      page: 0,
      roundOver: false,
      score: -1,
    };
  }

  handleAPIFetch = () => {
    const { page, roundOver, score } = this.state;
    const fetchPage = page + 1;
    const currentScore = score + 1;

    this.setState({
      data: null,
      scrambledSentence: null,
      lettersToGuess: null,
      score: currentScore,
      page: fetchPage,
      allRoundsComplete: false,
      currentGuessIndex: 0,
    });
    axios
      .get(`https://api.hatchways.io/assessment/sentences/${fetchPage}`)
      .then((res) => {
        const fetchedSentence = res.data.data.sentence;
        this.setState({ data: fetchedSentence });
      })
      .then(() => this.handleScrambleSentence())
      .catch((err) => {
        console.error(err);
      });
  };

  componentDidMount() {
    this.handleAPIFetch();
    document.addEventListener("keydown", this.handleGetChar);
  }

  handleResetGame = () => {
    const { page } = this.state;
    const pageUp = page + 1;
    this.setState({ page: pageUp });
    this.handleAPIFetch();
  };

  handleGetChar = (e) => {
    const { roundOver } = this.state;
    e.preventDefault();
    if (roundOver && e.code === "Enter") {
      this.handleResetGame();
    }
    let key = e.key;
    if (key.match(/^[a-zA-Z]{1}$/) || e.code === "Space") {
      this.handleGuessLetter(key);
    }
  };

  handleGuessLetter = (letter) => {
    const { lettersToGuess, currentGuessIndex, roundOver } = this.state;
    if (roundOver) {
      return;
    }
    const guessedLetterToLowerCase = letter.toLowerCase();
    const currentLetterToGuess = lettersToGuess[0];
    if (guessedLetterToLowerCase === currentLetterToGuess.toLowerCase()) {
      const lettersRemaining = lettersToGuess.slice(1);
      this.setState({ lettersToGuess: lettersRemaining });
      let correctLetter =
        document.getElementsByClassName("letter")[currentGuessIndex];
      correctLetter.style.background = "#4caf50";
      correctLetter.style.color = "white";
      correctLetter.innerText = currentLetterToGuess;
      if (lettersRemaining.length === 0) {
        console.log("you win the round");
        this.setState({ roundOver: true });
        return;
      }
      const incrementedCurrentGuessIndex = currentGuessIndex + 1;
      this.setState({ currentGuessIndex: incrementedCurrentGuessIndex });
    } else {
      const currentLetterToGuessLowerCase = currentLetterToGuess.toLowerCase();
      let currentSpace =
        document.getElementsByClassName("letter")[currentGuessIndex];
      currentSpace.innerText = letter;
    }
  };

  handleScrambleSentence = () => {
    const { data } = this.state;
    const wordArray = data.split(" ");
    this.setState({ wordLength: wordArray.length });
    const scrambledWordArray = wordArray.map((word) => {
      if (word.length < 4) {
        return word;
      }
      let letterArray = word.split("");
      let first = letterArray.shift();
      let last = letterArray.pop();
      let middle = letterArray.sort(() => Math.random() - 0.5).join("");
      return first + middle + last;
    });
    this.setState({
      lettersToGuess: data,
      scrambledSentence: scrambledWordArray.join(" "),
    });
  };
  render() {
    const { data, scrambledSentence, roundOver, score, allRoundsComplete } =
      this.state;
    return (
      <div className="container">
        {!allRoundsComplete && (
          <div className="page">
            <div className="text-display">
              <div className="sentence">
                {scrambledSentence
                  ? scrambledSentence
                  : "Fetching Hatchways API Data"}
              </div>
              <div>Guess the sentence! Starting typing</div>
              <br />
              {roundOver && (
                <button onClick={this.handleResetGame}>Next</button>
              )}
              <div>The yellow blocks are meant for spaces</div>
              <div>Score: {score}</div>
            </div>
            {scrambledSentence && (
              <Table data={data} scrambledSentence={scrambledSentence} />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
