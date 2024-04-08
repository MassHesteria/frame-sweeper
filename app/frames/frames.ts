import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";

export type Board = number[][];
export type Cell = -1|0|1

export type State = {
  data: number[][];
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: {
    data: [],
  },
  middleware: [farcasterHubContext({
      hubHttpUrl: "https://nemes.farcaster.xyz:2281",
      //hubHttpUrl: "http://localhost:3010/hub",
    }
  )]
});

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const initGame = (size: number, mines: number) => {
  let board: Board = [];
  for (let i = 0; i < size + 2; i++) {
    board.push(new Array(size + 2).fill(0));
  }

  //----------------------------------------
  // Randomly place mines
  //----------------------------------------

  let num = mines
  while (num > 0) {
    const i = getRandomNumber(1, size);
    const j = getRandomNumber(1, size);
    if (board[i][j] == -1) {
      continue;
    }
    board[i][j] = -1;
    num -= 1;
  }

  //----------------------------------------
  // Update counts for non-mine cells
  //----------------------------------------

  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      if (board[i][j] == -1) {
        continue
      }
      for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
          if (board[k][l] == -1) {
            board[i][j] += 1
          }
        }
      }
    }
  }

  let cells: Cell[][] = [];
  for (let i = 0; i < size + 2; i++) {
    cells.push(new Array(size + 2).fill(0));
  }

  return { board, cells };
};

export type Input = {
  row: number
  col: number
}

export const parseInputText = (text: string|undefined, size: number): Input[] | undefined => {
  if (text == undefined) {
    return undefined
  }
  const inputs =
    text.includes(',')
    ? text.split(',').map(a => a.trim())
    : text.split(' ').map(a => a.trim())

  return inputs
    .filter(i => i.length == 2)
    .map(i => {
      return {
        col: i.charCodeAt(0) - 'a'.charCodeAt(0) + 1,
        row: i.charCodeAt(1) - '0'.charCodeAt(0),
      }
    })
    .filter(i => i.row > 0 && i.col > 0 && i.row < size && i.col < size)
}

export const openedBomb = (board: Board, cells: Cell[][]) => {
  for (let i = 1; i < board.length - 1; i++) {
    for (let j = 1; j < board.length - 1; j++) {
      if (cells[i][j] == 1 && board[i][j] == -1) {
        return true
      }
    }
  }
  return false
}

export const isBoardCleared = (board: Board, cells: Cell[][]) => {
  for (let i = 1; i < board.length - 1; i++) {
    for (let j = 1; j < board.length - 1; j++) {
      if (cells[i][j] != 1 && board[i][j] != -1) {
        return false
      }
    }
  }
  return true
}

export const printBoard = (board: Board) => {
  for (let i = 1; i < board.length - 1; i++) {
    let row = ''
    for (let j = 1; j < board.length - 1; j++) {
      if (board[i][j] == -1) {
        row += 'x '
      } else {
        row += `${board[i][j]} `
      }
    }
    console.log(row)
  }
}