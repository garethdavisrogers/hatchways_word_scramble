import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: null,
      page: 0,
      rows: null,
      scrambledSentence: null,
      lettersGuessed: "",
      lettersToGuess: null,
      letterCounter: {},
      gameOver: true,
      score: -1,
    };
  }

  handleAPIFetch = () => {
    const { page, gameOver, score } = this.state;
    const fetchPage = page + 1;
    const currentScore = score + 1;
    const resetStateObject = {
      data: null,
      page: fetchPage,
      rows: null,
      scrambledSentence: null,
      lettersGuessed: "",
      lettersToGuess: null,
      letterCounter: {},
      gameOver: false,
      score: currentScore,
    };
    this.setState(resetStateObject);
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
    const { gameOver } = this.state;
    e.preventDefault();
    if (gameOver && e.keyCode === 13) {
      this.handleResetGame();
    }
    let key = e.key;
    if (key.match(/^[a-zA-Z]{1}$/)) {
      this.handleGuessLetter(key);
    }
  };

  handleGuessLetter = (letter) => {
    const { lettersToGuess, lettersGuessed, letterCounter, gameOver } =
      this.state;
    if (gameOver) {
      return;
    }
    const lowerCaseLetter = letter.toLowerCase();
    if (lowerCaseLetter == lettersToGuess[0].toLowerCase()) {
      const currentLetter = lettersToGuess.slice(0, 1);
      const lettersLeftSliced = lettersToGuess.slice(1);
      const lettersGuessedConcat = lettersGuessed + currentLetter;
      this.setState({
        lettersGuessed: lettersGuessedConcat,
        lettersToGuess: lettersLeftSliced,
      });

      let entry;
      if (letterCounter[lowerCaseLetter] !== undefined) {
        entry = letterCounter;
        entry[letter] += 1;
        this.setState({ letterCounter: entry });
      } else {
        entry = letterCounter;
        entry[lowerCaseLetter] = 0;
        this.setState({ letterCounter: entry });
      }
      let index = letterCounter[lowerCaseLetter];
      let correctLetter = document.getElementsByName(lowerCaseLetter)[index];
      correctLetter.style.background = "green";
      correctLetter.style.color = "white";
      correctLetter.innerText = currentLetter;
      if (lettersLeftSliced.length === 0) {
        console.log("you win");
        this.setState({ gameOver: true });
        return;
      }
    } else {
      console.log("incorrect");
    }
  };

  handleScrambleSentence = () => {
    const { data } = this.state;
    const wordArray = data.split(" ");
    this.setState({ wordLength: wordArray.length });
    const scrambled = wordArray.map((word) => {
      if (word.length < 4) {
        return word;
      }
      let letterArray = word.split("");
      let first = letterArray.shift();
      let last = letterArray.pop();
      letterArray.sort(() => Math.random() - 0.5);
      let middle = letterArray.join("");
      return first + middle + last;
    });
    this.setState({
      scrambledSentence: scrambled.join(" "),
      lettersToGuess: wordArray.join(""),
    });
  };
  render() {
    const { data, scrambledSentence, gameOver, score } = this.state;
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
            {gameOver && <button onClick={this.handleResetGame}>Next</button>}
            <div>The yellow blocks are meant for spaces</div>
            <div>Score: {score}</div>
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
