/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createBoard, frames, initShown, parseInput, printBoard } from "./frames";
import { getHostName} from "../data";
import { generateImage } from "./generate";
 
const handleRequest = frames(async (ctx) => {
  const currentState = ctx.state;
  const fid = ctx.message?.requesterFid;

  const timestamp = `${Date.now()}`
  const baseRoute = getHostName() + "/frames?ts=" + timestamp
  
  let board = currentState.board;
  let shown = currentState.shown;
  if (fid != undefined) {
    if (board.length == 0 || ctx.searchParams.newGame) {
      board = createBoard(3)
      shown = initShown(3)
    }
  } else {
      return ({
        image: generateImage(fid, board, shown),
        imageOptions: {
            aspectRatio: '1.91:1'
        },
        buttons: [
          <Button action="post" target={baseRoute + "&newGame=1"}>
            Start Playing
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
    shown
  }

  const input = parseInput(ctx.message?.inputText)
  if (input != undefined) {
    shown[input.row][input.col] = true
  }
  console.log(shown)
  //console.log(parseInput(ctx.message?.inputText))

  printBoard(board)
  return {
    image: generateImage(fid, board, shown),
    imageOptions: {
        aspectRatio: '1:1'
    },
    textInput: fid ? 'Move: a2, c1, etc.' : undefined,
    buttons: [
      <Button action="post" target={baseRoute + "&makeMove=1"}>
        Make Move
      </Button>,
      <Button action="post" target={baseRoute + "&newGame=1"}>
        New Game ↻
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