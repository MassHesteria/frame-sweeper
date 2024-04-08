/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import {
   Board,
   Cell,
   State,
   initGame,
   frames,
   parseInputText,
   printBoard,
   isBoardCleared,
   openedBomb,
} from "./frames";
import { getHostName} from "../data";
import { generateImage } from "./generate";

export const runtime = 'edge'

const decodeState = (state: State) => {
  const data = state.data;
  let board: Board = []
  let cells: Cell[][] = []
  for (let i = 0; i < data.length; i++) {
    board.push(data[i].map(c => (0xF & c) - 1))
    cells.push(data[i].map(c => (((0xF0 & c) >> 4) - 1) as Cell))
  }
  return {
    board: board,
    cells: cells,
  }
}

const encodeState = (board: Board, cells: Cell[][]) => {
  let data = [];
  for (let i = 0; i < board.length; i++) {
    const b_row = board[i].map(c => c + 1);
    const c_row = cells[i].map(c => c + 1);
    for (let j = 0; j < b_row.length; j++) {
      b_row[j] |= (c_row[j] << 4)
    }
    data.push(b_row)
  }
  return {
    data
  }
}

const handleRequest = frames(async (ctx: any) => {
  let fid = ctx.message?.requesterFid;
  const caster = ctx.message?.castId?.fid;
  //const follows = ctx.message?.requesterFollowsCaster;
  const follows = true;

  //console.log('fid:',fid)
  //console.log('caster:',caster)
  //console.log('follows:',follows)

  if (caster != fid && !follows) {
    fid = undefined
  }
  //console.log('final fid:',fid)

  const timestamp = `${Date.now()}`
  const baseRoute = getHostName() + "/frames?ts=" + timestamp
  const shareLink = "https://warpcast.com/~/compose?embeds[]=" +
    encodeURIComponent(getHostName());
  
  if (fid == undefined) {
    return ({
      image: generateImage(fid, [], [], false, false),
      imageOptions: {
          aspectRatio: '1.91:1'
      },
      buttons: [
        <Button action="post" target={baseRoute + "&newGame=1"}>
          Start Playing 🙂
        </Button>,
        <Button action="link" target={shareLink}>
          Share
        </Button>
      ],
      headers: { 
        // Max cache age in seconds
        "Cache-Control": "max-age=0", 
      }
    })
  }

  let { board, cells } = decodeState(ctx.state);
  if (board.length == 0 || ctx.searchParams.newGame) {
    const game = initGame(9, 10)
    board = game.board
    cells = game.cells
  }

  const showNeighors = (row: number, col: number) => {
    for (let i = row - 1; i <= row + 1; i++) {
      if (i == 0 || i == board.length - 1) {
        continue
      }
      for (let j = col - 1; j <= col + 1; j++) {
        if (j == 0 || j == board.length - 1) {
          continue
        }
        if (board[i][j] == -1 || cells[i][j] == 1) {
          continue
        }
        cells[i][j] = 1;
        if (board[i][j] == 0) {
          showNeighors(i, j);
        }
      }
    }
  }

  //console.log('processing input:',ctx.message?.inputText)
  const inputs = parseInputText(ctx.message?.inputText, board.length - 1);
  if (inputs != undefined) {
    inputs.forEach((input) => {
      if (ctx.searchParams.markMine) {
        // Don't mark cells that are already open
        if (cells[input.row][input.col] != 1) {
          cells[input.row][input.col] = -1;
        }
      } else if (ctx.searchParams.openCell) {
        cells[input.row][input.col] = 1;
        // Show neighbors if a cell with no adjacent mines is opened
        if (board[input.row][input.col] == 0) {
          showNeighors(input.row, input.col);
        }
      }
    });
  }

  const gameOver = openedBomb(board, cells)
  const boardCleared = isBoardCleared(board, cells)
  const gameEnded = gameOver || boardCleared

  //printBoard(board)
  return {
    image: generateImage(fid, board, cells, gameOver, boardCleared),
    imageOptions: {
        aspectRatio: '1:1'
    },
    textInput: (fid && !gameEnded) ? 'Enter Cells: a2 c1 i7 ...' : undefined,
    buttons: gameEnded
      ? [
        <Button action="post" target={baseRoute + "&newGame=1"}>
          Play Again ↻
        </Button>,
        <Button action="link" target={shareLink}>
          Share
        </Button>
      ] : [
      <Button action="post" target={baseRoute + "&markMine=1"}>
        Mark Mines
      </Button>,
      <Button action="post" target={baseRoute + "&openCell=1"}>
        Open Cells
      </Button>,
    ],
    state: encodeState(board, cells),
    headers: { 
      // Max cache age in seconds
      "Cache-Control": "max-age=0", 
    },
  };
});
 
export const GET = handleRequest;
export const POST = handleRequest;