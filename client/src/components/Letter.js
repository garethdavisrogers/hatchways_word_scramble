import React from "react";

export default function Letter({ letter, ind }) {
  return <div className="letter" name={letter.toLowerCase()}></div>;
}
