// Shortcut: cmd opt r
// Name: random
// determine a random number between min (default = 1) and max entered.

import "@johnlindquist/kit"
import { randomInt } from "crypto";

const WIDTH = 400;
const HEIGHT = 100;

const smallArg = (placeholder: string) => arg({
    placeholder: placeholder,
    height: HEIGHT,
    width: WIDTH
});

let input = await smallArg("Enter max (incl.)");
const max: number = parseInt(input); 
input = await smallArg("Enter min (incl.) - Return for 1");
const min: number = input? parseInt(input) : 1;

const random = `<div class="text-4xl">
                    Random in [${min}, ${max}]: ${randomInt(min, max + 1)}
                </div>`;
await div({
    html: random,
    height: HEIGHT,
    width: WIDTH
});