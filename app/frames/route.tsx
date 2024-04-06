/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { getHostName} from "../data";
 
const handleRequest = frames(async (ctx) => {
  //console.log(JSON.stringify(ctx))
  return {
    image: (
      <div tw="flex flex-col">
        <span>
          {ctx.pressedButton
            ? `I clicked ${ctx.searchParams.value}`
            : `Click some button`}
        </span>
        <span>
          {ctx.message?.inputText
            ? `Text: ${ctx.message.inputText}`
            : 'no text'}
        </span>
      </div>
    ),
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
    headers: { 
      // Max cache age in seconds
      "Cache-Control": "max-age=0", 
    },
  };
});
 
export const GET = handleRequest;
export const POST = handleRequest;