export const HeaderRow = () => {
  const cols = [' ','a','b','c','d','e','f','g','h','i']
  return (
    <div tw="flex flex-row w-full h-1/12 pl-22 text-3xl text-amber-900 pb-5">
      {cols.map(c => {
        return (
          <div key={c} tw="flex w-1/12 h-full">
            <span tw="mx-auto mt-auto">{c}</span>
          </div>
        )
      })}
    </div>
  )
}