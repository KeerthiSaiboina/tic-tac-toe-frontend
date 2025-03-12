import "./styles.css";

import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";

const API_URL = "https://your-backend-url.com/api/scores"; // Replace with your backend URL

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await axios.get(API_URL);
      setScores(response.data);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      saveScore(gameWinner);
    } else if (!newBoard.includes(null)) {
      setWinner("Draw");
    }
  };

  const checkWinner = (newBoard) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return null;
  };

  const saveScore = async (gameWinner) => {
    try {
      await axios.post(API_URL, { winner: gameWinner });
      fetchScores();
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="container">
      <h1>Tic-Tac-Toe</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} className="cell" onClick={() => handleClick(index)}>
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div className="winner">
          <h2>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>
          <button onClick={resetGame}>New Game</button>
        </div>
      )}
      <div className="scoreboard">
        <h2>Last 5 Games</h2>
        <ul>
          {scores.map((score, index) => (
            <li key={index}>
              {score.winner} won at{" "}
              {new Date(score.timestamp).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
