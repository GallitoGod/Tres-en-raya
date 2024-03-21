import confetti from 'canvas-confetti';
import { useState } from 'react';
import './App.css'

import { Square } from './components/Square.jsx';
import { TURNS } from './components/constants.js';
import { checkWinnerForm } from './components/logic.js';
import { WinnerModal } from './components/WinnerModal.jsx';

export default function App() {
  const [board,setBoard] = useState(
    Array(9).fill(null)
  );
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  }

  const updateBoard = (index) => {
    if(board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    const newWinner = checkWinnerForm(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  }

  return (
    <main className="board">
      <h2>Tic Tac Toe</h2>
      <button onClick={resetGame}> Reset del juego</button>
      <section className="game">
        {
          board.map((_,index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal 
        resetGame={resetGame}
        winner={winner}
      />

    </main>
  )
}

