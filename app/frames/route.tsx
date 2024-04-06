/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createBoard, frames, initShown } from "./frames";
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

  console.log(JSON.stringify(ctx))
  return {
    image: generateImage(fid, currentState),
    imageOptions: {
        aspectRatio: '1:1'
    },
    textInput: 'Move:',
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