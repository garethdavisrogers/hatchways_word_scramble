import React from "react";

export default function Row({ word, isLast }) {
  const letters = word.split("");
  return (
    <div className="row">
      {letters.map((letter, ind) => (
        <div className="letter" key={letter + ":" + ind} />
      ))}
      {isLast && <div className="letter" style={{ background: "gold" }} />}
    </div>
  );
}
