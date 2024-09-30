// utils/gameLogic.js

export const createBoard = (size) => {
    const board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    addRandomTile(board);
    addRandomTile(board);
    return board;
  };
  
  export const addRandomTile = (board) => {
    const emptyTiles = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (!board[row][col]) emptyTiles.push({ row, col });
      }
    }
    if (emptyTiles.length === 0) return;
  
    const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
  };
  
  const slide = (row) => {
    let arr = row.filter(val => val);
    let missing = row.length - arr.length;
    let zeros = Array(missing).fill(null);
    arr = zeros.concat(arr);
    return arr;
  };
  
  const combine = (row) => {
    for (let i = row.length - 1; i >= 1; i--) {
      let a = row[i];
      let b = row[i - 1];
      if (a === b) {
        row[i] = a + b;
        row[i - 1] = null;
      }
    }
    return row;
  };
  
  const operate = (row) => {
    row = slide(row);
    row = combine(row);
    row = slide(row);
    return row;
  };
  
  export const moveLeft = (board) => {
    let newBoard = [];
    for (let i = 0; i < board.length; i++) {
      newBoard.push(operate(board[i]));
    }
    return newBoard;
  };
  
  export const moveRight = (board) => {
    let newBoard = [];
    for (let i = 0; i < board.length; i++) {
      newBoard.push(operate(board[i].reverse()).reverse());
    }
    return newBoard;
  };
  
  export const rotateLeft = (board) => {
    let newBoard = [];
    for (let i = 0; i < board.length; i++) {
      let newRow = [];
      for (let j = 0; j < board.length; j++) {
        newRow.push(board[j][i]);
      }
      newBoard.push(newRow.reverse());
    }
    return newBoard;
  };
  
  export const moveUp = (board) => {
    let newBoard = rotateLeft(board);
    newBoard = moveLeft(newBoard);
    newBoard = rotateLeft(newBoard);
    newBoard = rotateLeft(newBoard);
    newBoard = rotateLeft(newBoard);
    return newBoard;
  };
  
  export const moveDown = (board) => {
    let newBoard = rotateLeft(board);
    newBoard = moveRight(newBoard);
    newBoard = rotateLeft(newBoard);
    newBoard = rotateLeft(newBoard);
    newBoard = rotateLeft(newBoard);
    return newBoard;
  };
  