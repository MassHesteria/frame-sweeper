import { Board, Cell, isGameOver } from "./frames";

const IntroPage = () => {
  return (
    <div tw="flex">
      <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-center p-8">
        <h2 tw="flex flex-col text-8xl font-bold tracking-tight text-left">
          <span tw="font-bold pb-5" style={{color: "#b16286"}}>Minesweeper</span>
          <span tw="font-bold" style={{color: "#8ec07c"}}>by MassHesteria</span>
        </h2>
      </div>
    </div>
  )
}

const Row = ({
  row,
  idx,
  cells,
  gameOver
}: {
  row: number[];
  idx: number;
  cells: Cell[][];
  gameOver: boolean;
}) => {
  const getTile = (value: number) => {
    if (value == -1) {
      return "X";
    }
    return value;
  };
  const getRowLabel = () => {
    if (idx == 0) {
      return "";
    }
    return `${idx}`;
  };
  const getColumnLabel = (i: number) => {
    return String.fromCharCode("a".charCodeAt(0) + i - 1);
  };
  const getBackgroundColor = (i: number) => {
    if (gameOver) {
      if (row[i] == -1) {
        return 'bg-red-700'
      }
    }
    if (cells[idx][i] == 1) {
      return 'bg-green-500'
    } else if (cells[idx][i] == -1) {
      return 'bg-yellow-500'
    }
    return ''
  }
  return (
    <div tw="flex flex-row w-full h-1/10">
      {row.map((c, i, arr) => {
        if (idx == 0) {
          if (i != 0 && i < arr.length - 1) {
            return (
              <div key={i} tw="flex w-1/10 h-full">
                <span tw="mx-auto mt-auto pb-5">{getColumnLabel(i)}</span>
              </div>
            );
          }
        }
        if (i == 0) {
          return (
            <div key={i} tw="flex w-1/10 h-full">
              <span tw="ml-auto my-auto pr-5">{getRowLabel()}</span>
            </div>
          );
        } else if (i > 0 && i < arr.length - 1) {
          const classes =
            "flex border-2 border-black w-1/10 h-full " +
            getBackgroundColor(i)
          return (
            <div key={i} tw={classes}>
              <span tw="m-auto">{getTile(c)}</span>
            </div>
          );
        }
      })}
    </div>
  );
};

export const generateImage = (
  fid: number | undefined,
  board: Board,
  cells: Cell[][]
) => {
  if (fid == undefined) {
    return <IntroPage />;
  }
  return (
    <div tw="flex w-full">
      <div tw="flex flex-col w-full">
        <span tw="text-red-700 pb-10 mx-auto">Board</span>
        {board.map((r, i, arr) => {
          if (i < arr.length - 1) {
            return (
              <Row
                key={i}
                row={r}
                idx={i}
                cells={cells}
                gameOver={isGameOver(board, cells)}
              />
            );
          }
        })}
        {/*<span>
          {ctx.pressedButton
            ? `I clicked ${ctx.searchParams.value}`
            : `Click some button`}
        </span>
        <span>
          {ctx.message?.inputText
            ? `Text: ${ctx.message.inputText}`
            : 'no text'}
          </span>*/}
      </div>
    </div>
  );
};