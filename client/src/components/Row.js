import React from "react";
import Letter from "./Letter";

export default function Row({ word, isLastRow }) {
  if (!isLastRow) {
    word += " ";
  }
  const letters = word.split("");
  return (
    <div className="row">
      {letters.map((letter, ind) => (
        <Letter letter={letter} ind={ind} key={letter + ":" + ind} />
      ))}
    </div>
  );
}
