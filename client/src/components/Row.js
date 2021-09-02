import React from "react";
import Letter from "./Letter";

export default function Row({ word, isLast }) {
  const letters = word.split("");
  return (
    <div className="row">
      {letters.map((letter, ind) => (
        <Letter letter={letter} ind={ind} key={letter + ":" + ind} />
      ))}
      {isLast && <div className="letter" style={{ background: "gold" }} />}
    </div>
  );
}
