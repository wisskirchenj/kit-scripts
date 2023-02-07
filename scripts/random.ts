// Shortcut: cmd opt r
// Name: random
// determine a random number between min (default = 1) and max entered.

import "@johnlindquist/kit"
import { randomInt } from "crypto";

let input = await arg("Enter max (incl.)");
const max: number = parseInt(input); 
input = await arg("Enter min (incl.) - Return for 1");
const min: number = input? parseInt(input) : 1;

const random = `<div class="text-4xl">
                    Random in [${min}, ${max}]: ${randomInt(min, max + 1)}
                </div>`;
await div(random);