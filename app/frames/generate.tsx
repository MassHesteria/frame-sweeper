import { State } from "./frames";

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

export const generateImage = (fid: number | undefined, state: State) => {
  if (fid == undefined) {
    return <IntroPage />
  }
  return (
      <div tw="flex flex-col">
        <div tw="flex flex-row">
          <span tw="w-1/5">x</span>
          <span tw="w-1/5">x</span>
          <span tw="w-1/5">x</span>
        </div>
        <div tw="flex flex-row">
          <span tw="w-1/5">x</span>
          <span tw="w-1/5">x</span>
          <span tw="w-1/5">x</span>
        </div>
        <div tw="flex flex-row">
          <span tw="w-1/5">x</span>
          <span tw="w-1/5">x</span>
          <span tw="w-1/5">x</span>
        </div>
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
        <span>
          Count {state.board}
          Count {state.shown}
        </span>
      </div>
  )
}