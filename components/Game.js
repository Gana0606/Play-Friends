"use client"
import React, { useState, useEffect } from 'react';
import { createBoard, addRandomTile, moveLeft, moveRight, moveUp, moveDown, isGameOver } from '../lib/gameLogic';
import styles from './Game.module.css';

const Game = () => {
  const [board, setBoard] = useState([]);
  const [previousBoard, setPreviousBoard] = useState(null); // To store the previous state
  const [gameOver, setGameOver] = useState(false) // New state for game over
  const [newTile, setNewTile] = useState(null); // To track the new tile position
  const [score, setScore] = useState(0); // Track score


  // Initialize the board on the client side
  useEffect(() => {
    setBoard(createBoard(4));
  }, []);

  const handleKeyDown = (e) => {
    if (gameOver) return; // Don't allow moves if the game is over

    let newBoard, scoreIncrease;
    switch (e.key) {
      case 'ArrowRight':
        ({ newBoard, scoreIncrease } = moveRight(board));
        break;
      case 'ArrowLeft':
        ({ newBoard, scoreIncrease } = moveLeft(board));
        break;
      case 'ArrowUp':
        ({ newBoard, scoreIncrease } = moveDown(board));
        break;
      case 'ArrowDown':
        ({ newBoard, scoreIncrease } = moveUp(board));
        break;
      default:
        return;
    }


    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      setPreviousBoard([...board]); // Store the previous board before the move
      
      const tilePosition = addRandomTile(newBoard); // Get the new tile position
      setNewTile(tilePosition); // Track the new tile
      setBoard(newBoard);
    
      // Update the score based on the value of the combined tiles
      setScore(prevScore => prevScore + scoreIncrease); // Increment the score

      // Check if the game is over
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };
  // Restart the game by resetting the board and state
  const restartGame = () => {
    setBoard(createBoard(4));
    setGameOver(false);
    setPreviousBoard(null);
    setScore(0); // Reset the score
  };

  // Undo the last move by restoring the previous board state
  const undoMove = () => {
    if (previousBoard) {
      setBoard(previousBoard);
      setPreviousBoard(null); // Only allow one undo move for simplicity
    }
  };

  // Reset new tile after every update
  useEffect(() => {
    if (newTile) {
      const timer = setTimeout(() => setNewTile(null), 300); // Reset after animation
      return () => clearTimeout(timer);
    }
  }, [newTile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board]);

  return (
    <div className={styles.includingGame}>

      <div className={styles.gameContainer}>
        {/* Display Score */}
        <div className={styles.scoreContainer}>
          <div className={styles.scoreLabel}>Score:</div>
          <div className={styles.scoreValue}>{score}</div>
        </div>

        <div className={styles.board}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((tile, colIndex) => (
                <div
                  key={colIndex}
                  className={`${styles.tile} ${styles[`tile${tile}`]} ${newTile && newTile.row === rowIndex && newTile.col === colIndex ? styles.tileNew : ''}`}
                >
                  {tile !== null ? tile : ''}
                </div>
              ))}
            </div>
          ))}
          {gameOver && (
            <div className={styles.gameOverOverlay}>
              <div className={styles.gameOverText}>Game Over</div>
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={undoMove} className={styles.button} disabled={!previousBoard}>Undo</button>
          <button onClick={restartGame} className={styles.button}>Restart</button>
        </div>
      </div>

      
    </div>
  );
};

export default Game;
