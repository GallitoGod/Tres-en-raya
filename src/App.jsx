import confetti from 'canvas-confetti';
import { useState } from 'react';

import { Square } from './components/Square.jsx';
import { TURNS } from './components/constants.js';
import { checkWinnerForm } from './components/logic.js';
import { WinnerModal } from './components/WinnerModal.jsx';
import { saveGameFromTheStorage, resetGameStorage } from './components/index.js';

export default function App() {
  const [board,setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board');
    return boardFromStorage 
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });
  
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X;
  });
  
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    resetGameStorage();
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
    saveGameFromTheStorage({
      board: newBoard,
      turn: newTurn
    });
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
      <h2>Tres en raya</h2>
      <button onClick={resetGame}> Resetea el juego</button>
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

