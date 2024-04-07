import { Board, Cell, isBoardCleared, openedBomb } from "./frames";

const IntroPage = () => {
  return (
    <div tw="flex bg-orange-200 h-full w-full">
      <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-center p-8">
        <h2 tw="flex flex-col font-bold tracking-tight text-left">
          <span tw="font-bold pb-5 text-8xl text-amber-900">Minesweeper</span>
          <span tw="font-bold pb-6 text-5xl text-amber-700">by MassHesteria</span>
          <span tw="font-bold pt-16 text-6xl text-amber-900">Follow to Play!</span>
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
  const getTile = (value: number, col: number) => {
    if (cells[idx][col] == -1) {
      return '🔴'
    }
    if (cells[idx][col] == 0 || value == 0) {
      return ' '
    }
    if (value == -1) {
      return "X";
    }
    if (value == 1) {
      return <span tw="text-blue-800">1</span>
    } else if (value == 2) {
      return <span tw="text-green-900">2</span>
    } else if (value == 3) {
      return <span tw="text-red-900">3</span>
    } else if (value == 4) {
      return <span tw="text-purple-800">4</span>
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
        if (cells[idx][i] == -1) {
          return 'bg-green-500'
        }
        return 'bg-red-700'
      }
    }
    if (cells[idx][i] == 1) {
      return 'bg-orange-300'
    }
    return 'bg-orange-400'
  }
  return (
    <div tw="flex flex-row w-full h-1/12 pl-22">
      {row.map((c, i, arr) => {
        if (idx == 0) {
          if (i != 0 && i < arr.length - 1) {
            return (
              <div key={i} tw="flex w-1/12 h-full">
                <span tw="mx-auto mt-auto pb-5 text-amber-900">{getColumnLabel(i)}</span>
              </div>
            );
          }
        }
        if (i == 0) {
          return (
            <div key={i} tw="flex w-1/12 h-full">
              <span tw="ml-auto my-auto pr-5 text-amber-900">{getRowLabel()}</span>
            </div>
          );
        } else if (i > 0 && i < arr.length - 1) {
          const classes =
            "flex border-2 border-amber-900 w-1/12 h-full " +
            getBackgroundColor(i)
          return (
            <div key={i} tw={classes}>
              <span tw="m-auto text-6xl">{getTile(c, i)}</span>
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
  const numMarked = cells.flat().filter(c => c == -1).length;
  return (
    <div tw="flex w-full h-full bg-orange-200">
      <div tw="flex flex-col w-full">
        <div tw="flex flex-row w-2/3 pt-7 mx-auto pb-3 justify-between">
          <span tw="text-amber-900 text-5xl mt-4 text-left">Minesweeper</span>
          <span tw="text-amber-900 text-5xl mt-4 text-right">Unmarked: {10-numMarked}</span>
        </div>
        {board.map((r, i, arr) => {
          if (i < arr.length - 1) {
            return (
              <Row
                key={i}
                row={r}
                idx={i}
                cells={cells}
                gameOver={openedBomb(board, cells)}
              />
            );
          }
        })}
        {isBoardCleared(board, cells) &&
          <span tw="bg-gray-200 px-10 py-6 text-black shadow-xl text-9xl rounded-lg opacity-95"
                style={{position: 'absolute', top: '500px', left: '300px' }}>
                You win!
          </span>}
      </div>
    </div>
  );
};