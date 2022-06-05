import React from "react";

export default function Scores() {
  const timesRolled = localStorage.getItem("timesRolled");
  const timePlayed = localStorage.getItem("playerTime");

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <div className="scores">
      <div className="scores-type">Time</div>
      <div className="scores-type">Rolled Dice</div>
      <div className="scores-data">
        {millisToMinutesAndSeconds(timePlayed)}{" "}
      </div>
      <div className="scores-data"> {timesRolled} times</div>
      {/*currently working on leaderboard*/}
    </div>
  );
}
