import { useState } from "react";
import useScore from "../src/stores/score";
const useWorldle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const { addWin } = useScore();
  //format a guess into a array of letter objects
  const formateGuess = () => {
    // console.log("formatting the guess - ", currentGuess);
    let solutionArray = [...solution];
    let formattedGuess = [...currentGuess].map((i) => {
      return { key: i, color: "null" };
    });

    //find any green letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray[i] === l.key) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null;
      }
    });
    //find any yellow letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== "green") {
        formattedGuess[i].color = "yellow";
        solutionArray[solutionArray.indexOf(l.key)] = null;
      }
    });
    return formattedGuess;
  };
  const addNewGuesses = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true);
      addWin();
    }
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess];
    });
    setUsedKeys((prevUsedKeys) => {
      formattedGuess.forEach((l) => {
        const currentColor = prevUsedKeys[l.key];
        if (l.color === "green") {
          prevUsedKeys[l.key] = "green";
          return;
        }
        if (l.color === "yellow" && currentColor !== "green") {
          prevUsedKeys[l.key] = "almost";
          return;
        }
        if (l.color === "null" && currentColor !== ("green" || "yellow")) {
          prevUsedKeys[l.key] = "null";
          return;
        }
      });
      return prevUsedKeys;
    });
    setTurn(turn + 1);
    setCurrentGuess("");
  };
  const handleKeyUp = ({ key }) => {
    if (key === "Enter") {
      if (turn > 5) return;

      if (history.includes(currentGuess)) return;

      if (currentGuess.length !== 5) return;

      const formatted = formateGuess();
      addNewGuesses(formatted);
    }

    if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    }

    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => {
          return prev + key;
        });
      }
    }
  };

  return {
    turn,
    currentGuess,
    guesses,
    usedKeys,
    isCorrect,
    handleKeyUp,
  };
};

export default useWorldle;
