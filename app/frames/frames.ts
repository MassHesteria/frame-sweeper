import { createFrames } from "frames.js/next";

export type Board = number[][];

export type State = {
  board: number[][];
  shown: boolean[][];
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: {
    board: [],
    shown: []
  },
});

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const createBoard = (size: number) => {
  let board: Board = [];
  for (let i = 0; i < size + 2; i++) {
    board.push(new Array(size + 2).fill(0))
  }

  let num = 2
  while (num > 0) {
    const i = getRandomNumber(1, 3);
    const j = getRandomNumber(1, 3);
    if (board[i][j] == -1) {
      continue;
    }
    board[i][j] = -1;
    num -= 1;
  }

  return board
}

export const initShown = (size: number) => {
  let shown: boolean[][] = [];
  for (let i = 0; i < size; i++) {
    shown.push(new Array(size).fill(false))
  }
  return shown
}