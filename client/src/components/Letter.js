import React from "react";

export default function Letter({ letter, ind }) {
  if (letter === " ") {
    return <div className="letter space-block" name={letter}></div>;
  }
  return <div className="letter" name={letter.toLowerCase()}></div>;
}
