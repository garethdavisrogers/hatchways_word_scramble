import React from "react";
import Row from "./Row";

export default function Table({ data }) {
  const words = data.split(" ");
  return (
    <div className="table">
      {words.map((word, ind) => (
        <Row key={word + ":" + ind} word={word} />
      ))}
    </div>
  );
}
