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
    if (emptyTiles.length === 0) return null;
  
    const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
    
    return { row, col }; // Return the position of the new tile
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
    let scoreGained = 0;
    row = slide(row);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== null) {
        row[i] *= 2;
        scoreGained += row[i]; // Track score based on tile combinations
        row[i + 1] = null;
      }
    }
    row = slide(row);
    return { row, scoreGained };
  };
  
  export const moveLeft = (board) => {
    let newBoard = [];
    let scoreIncrease = 0;
    for (let i = 0; i < board.length; i++) {
      const { row, scoreGained } = operate(board[i].reverse());
      newBoard.push(row.reverse());
      scoreIncrease += scoreGained;
    }
    return { newBoard, scoreIncrease };
  };
  
  export const moveRight = (board) => {
    let newBoard = [];
    let scoreIncrease = 0;
    
    for (let i = 0; i < board.length; i++) {
      const { row, scoreGained } = operate(board[i]); // Reverse for right move
      newBoard.push(row); // Reverse back to original order
      scoreIncrease += scoreGained;
    }
  
    return { newBoard, scoreIncrease };
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
  
  export const rotateRight = (board) => {
    let newBoard = rotateLeft(board);
    newBoard = rotateLeft(newBoard);
    newBoard = rotateLeft(newBoard); // Rotating left three times equals a right rotation
    return newBoard;
  };
  
  
  export const moveDown = (board) => {
    let newBoard = rotateLeft(board);
    let { newBoard: movedBoard, scoreIncrease } = moveRight(newBoard); // Use moveRight on rotated board
    newBoard = rotateRight(movedBoard); // Rotate it back to the original orientation
    
    return { newBoard, scoreIncrease };
  };

  export const moveUp = (board) => {
    let newBoard = rotateLeft(board);
    let { newBoard: movedBoard, scoreIncrease } = moveLeft(newBoard); // Use moveLeft on rotated board
    newBoard = rotateRight(movedBoard); // Rotate it back to the original orientation
    
    return { newBoard, scoreIncrease };
  };
  
  
  

  // Check if the game is over by verifying if there are no valid moves
export const isGameOver = (board) => {
  // Check for any empty tiles
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        return false; // Game is not over, empty tile exists
      }
    }
  }

  // Check if there are any possible merges horizontally or vertically
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length - 1; col++) {
      if (board[row][col] === board[row][col + 1]) {
        return false; // Mergeable tiles exist horizontally
      }
    }
  }
  for (let col = 0; col < board[0].length; col++) {
    for (let row = 0; row < board.length - 1; row++) {
      if (board[row][col] === board[row + 1][col]) {
        return false; // Mergeable tiles exist vertically
      }
    }
  }

  // No empty spaces and no possible merges, game is over
  return true;
};
