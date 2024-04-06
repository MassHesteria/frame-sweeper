/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createBoard, frames, initShown, printBoard } from "./frames";
import { getHostName} from "../data";
import { generateImage } from "./generate";
 
const handleRequest = frames(async (ctx) => {
  const currentState = ctx.state;
  const fid = ctx.message?.requesterFid;
  
  let board = currentState.board;
  let shown = currentState.shown;
  if (fid) {
    if (board.length == 0) {
      board = createBoard(3)
      shown = initShown(3)
    }
  }

  const updatedState = {
    ...currentState,
    board,
    shown
  }

  printBoard(board)
  return {
    image: generateImage(fid, board),
    imageOptions: {
        aspectRatio: '1:1'
    },
    textInput: fid ? 'Move:' : undefined,
    buttons: [
      <Button action="post" target={getHostName() + "/frames?value=Yes"}>
        Say Yes
      </Button>,
      <Button action="post" target={getHostName() + "/frames?value=No"}>
        Say No
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