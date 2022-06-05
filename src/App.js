import React, { useEffect, useState } from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Scores from "./components/Scores";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [timesRolled, setTimesRolled] = useState(0);

  const width = window.outterWidth;
  const height = window.outterHeight;

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.value === dice[0].value);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  useEffect(() => {
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    localStorage.setItem("playerTime", JSON.stringify(time));
    localStorage.setItem("timesRolled", JSON.stringify(timesRolled));
  }, [time]);

  function increaseCount() {
    setTimesRolled(timesRolled + 1);
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function resetTimer() {
    !timerOn && time > 0 && setTime(0) && setTimerOn(false);
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));
  const stopWatch = (
    <div id="display">
      <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
      <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
    </div>
  );

  return (
    <>
      {tenzies && !show && <Confetti width={width} height={height} />}
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>

        <div className="dice-container">{diceElements}</div>

        {!tenzies ? (
          <h2 className="start-game">
            {!timerOn
              ? "Ready? Roll dice to start your game"
              : "Finish as fast as you can!"}
          </h2>
        ) : (
          <h2 className="start-game">You Won!</h2>
        )}

        <div className="roll-dice-container">
          {!show && (
            <button
              className="roll-dice"
              onClick={() => {
                rollDice();
                time == 0 && setTimerOn(true);
                resetTimer();
                increaseCount();
                tenzies && setTimesRolled(0);
              }}
            >
              {tenzies ? "New Game" : "Roll"}
            </button>
          )}
          {tenzies && (
            <button className="roll-dice" onClick={() => setShow(!show)}>
              {show ? "close window" : "See your stats!"}
            </button>
          )}
        </div>

        {timerOn && tenzies && setTimerOn(false)}

        {show && <Scores />}
      </main>
    </>
  );
}
