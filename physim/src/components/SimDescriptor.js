import React from "react";
import { useHistory } from "react-router";

export default function SimDescriptor(props) {
  // component props
  const { buttonLabel, pathUrl } = props;

  // URL history
  let history = useHistory();

  // function to handle click
  function HandleClick() {
    history.push(pathUrl);
  }

  return (
    <div>
      <button onClick={HandleClick}>{buttonLabel}</button>
    </div>
  );
}
