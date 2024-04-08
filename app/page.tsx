import { fetchMetadata } from "frames.js/next";
import { getHostName } from "./data";

//export const runtime = 'edge'
 
export async function generateMetadata() {
  return {
    title: "Minesweeper!",
    description: "Play Minesweeper in a Frame",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL("/frames", getHostName())
    ),
  };
}

export default function Home() {
  return (
    <main>
      <div>Minesweeper Frame for Farcaster</div>
      <div><a className="text-red-600 no-underline hover:underline" href="https://github.com/masshesteria/frame-sweeper">Source code</a></div>
    </main>
  );
}
