/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { initGame, frames, isGameOver, parseInput, printBoard } from "./frames";
import { getHostName} from "../data";
import { generateImage } from "./generate";
 
const handleRequest = frames(async (ctx) => {
  const currentState = ctx.state;
  const fid = ctx.message?.requesterFid;

  const timestamp = `${Date.now()}`
  const baseRoute = getHostName() + "/frames?ts=" + timestamp
  
  let board = currentState.board;
  let cells = currentState.cells;
  if (fid != undefined) {
    if (board.length == 0 || ctx.searchParams.newGame) {
      const game = initGame(5)
      board = game.board
      cells = game.cells
    }
  } else {
      return ({
        image: generateImage(fid, board, cells),
        imageOptions: {
            aspectRatio: '1.91:1'
        },
        buttons: [
          <Button action="post" target={baseRoute + "&newGame=1"}>
            Start Playing 🙂
          </Button>
        ],
        headers: { 
          // Max cache age in seconds
          "Cache-Control": "max-age=0", 
        }
    })
  }

  const updatedState = {
    ...currentState,
    board,
    cells
  }

  if (!isGameOver(board, cells)) {
    const input = parseInput(ctx.message?.inputText)
    if (input != undefined) {
      if (ctx.searchParams.markMine) {
        cells[input.row][input.col] = -1
      } else {
        cells[input.row][input.col] = 1
      }
    }
    console.log(cells)
  }
  //console.log(parseInput(ctx.message?.inputText))

  printBoard(board)
  return {
    image: generateImage(fid, board, cells),
    imageOptions: {
        aspectRatio: '1:1'
    },
    textInput: fid ? 'Enter Cell: a2, c1, etc.' : undefined,
    buttons: [
      <Button action="post" target={baseRoute + "&markMine=1"}>
        Mark Mine
      </Button>,
      <Button action="post" target={baseRoute + "&makeMove=1"}>
        Open Cell
      </Button>,
    ],
    state: updatedState,
    headers: { 
      // Max cache age in seconds
      "Cache-Control": "max-age=0", 
    },
  };
});
 
export const GET = handleRequest;
export const POST = handleRequest;