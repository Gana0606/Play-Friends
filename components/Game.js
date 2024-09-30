"use client"
import React, { useState, useEffect } from 'react';
import { createBoard, addRandomTile, moveLeft, moveRight, moveUp, moveDown } from '../utils/gameLogic';
import styles from './Game.module.css';

const Game = () => {
  const [board, setBoard] = useState([]);

  // Initialize the board on the client side
  useEffect(() => {
    setBoard(createBoard(4));
  }, []);

  const handleKeyDown = (e) => {
    let newBoard;
    switch (e.key) {
      case 'ArrowRight':
        newBoard = moveLeft(board);
        break;
      case 'ArrowLeft':
        newBoard = moveRight(board);
        break;
      case 'ArrowUp':
        newBoard = moveUp(board);
        break;
      case 'ArrowDown':
        newBoard = moveDown(board);
        break;
      default:
        return;
    }
    addRandomTile(newBoard);
    setBoard(newBoard);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board]);

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((tile, colIndex) => (
            <div key={colIndex} className={`${styles.tile} ${styles[`tile${tile}`]}`}>
              {tile !== null ? tile : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Game;
