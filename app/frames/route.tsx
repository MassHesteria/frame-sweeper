/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { initGame, frames, parseInputText, printBoard, isBoardCleared, openedBomb } from "./frames";
import { getHostName} from "../data";
import { generateImage } from "./generate";
 
const handleRequest = frames(async (ctx: any) => {
  let fid = ctx.message?.requesterFid;
  const caster = ctx.message?.castId?.fid;
  const follows = ctx.message?.requesterFollowsCaster;

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
  
  let { board, cells } = ctx.state;
  if (fid != undefined) {
    if (board.length == 0 || ctx.searchParams.newGame) {
      const game = initGame(9, 10)
      board = game.board
      cells = game.cells
    }
  } else {
      return ({
        image: generateImage(fid, board, cells, false, false),
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
    state: {
      board,
      cells
    },
    headers: { 
      // Max cache age in seconds
      "Cache-Control": "max-age=0", 
    },
  };
});
 
export const GET = handleRequest;
export const POST = handleRequest;