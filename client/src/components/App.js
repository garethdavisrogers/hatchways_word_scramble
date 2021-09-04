import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      page: 0,
      score: -1,
      gameOver: false,
    };
  }

  handleAPIFetch = () => {
    const { page, roundOver, score } = this.state;
    if (score === 9) {
      this.setState({ gameOver: true });
      return;
    }
    const fetchPage = page + 1;
    const currentScore = score + 1;
    this.setState({
      data: null,
      scrambledSentence: null,
      lettersToGuess: null,
      score: currentScore,
      page: fetchPage,
      currentGuessIndex: 0,
      roundOver: false,
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

    const currentLetterSpace =
      document.getElementsByClassName("letter")[currentGuessIndex];
    currentLetterSpace.removeChild(currentLetterSpace.childNodes[0]);
    const guessedLetterToLowerCase = letter.toLowerCase();
    const currentLetterToGuess = lettersToGuess[0];
    if (guessedLetterToLowerCase === currentLetterToGuess.toLowerCase()) {
      const lettersRemaining = lettersToGuess.slice(1);
      this.setState({ lettersToGuess: lettersRemaining });

      currentLetterSpace.style.background = "#4caf50";
      currentLetterSpace.style.color = "white";
      currentLetterSpace.innerText = currentLetterToGuess;
      if (lettersRemaining.length === 0) {
        this.setState({ roundOver: true });
        return;
      }
      const incrementedCurrentGuessIndex = currentGuessIndex + 1;
      this.setState({ currentGuessIndex: incrementedCurrentGuessIndex });
      const cursor = document.createElement("div");
      cursor.classList.add("blinking");
      cursor.innerText = "|";
      document
        .getElementsByClassName("letter")
        [incrementedCurrentGuessIndex].appendChild(cursor);
    } else {
      const currentLetterToGuessLowerCase = currentLetterToGuess.toLowerCase();
      currentLetterSpace.innerText = letter;
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
    const startingCursor = document.createElement("div");
    startingCursor.classList.add("blinking");
    startingCursor.innerText = "|";
    document.getElementsByClassName("letter")[0].appendChild(startingCursor);
  };
  render() {
    const { data, scrambledSentence, roundOver, score, gameOver } = this.state;
    return (
      <div className="container">
        {gameOver === false && (
          <div className="page">
            <div className="text-display">
              <div className="sentence">
                {scrambledSentence
                  ? scrambledSentence
                  : "Fetching Hatchways API Data"}
              </div>
              <div>Guess the sentence! Starting typing</div>
              <div>The yellow blocks are meant for spaces</div>
              <div>Score: {score}</div>
            </div>
            {scrambledSentence && (
              <Table data={data} scrambledSentence={scrambledSentence} />
            )}
            {roundOver && (
              <div className="btn" onClick={this.handleResetGame}>
                Next
              </div>
            )}
          </div>
        )}
        <div>{gameOver && <div>You Win!</div>}</div>
      </div>
    );
  }
}

export default App;
