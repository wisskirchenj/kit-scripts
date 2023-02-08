// Shortcut: cmd opt f
import "@johnlindquist/kit";

const smallArg = (placeholder: string) => arg({
    placeholder: placeholder,
    height: 100,
    width: 500
});

const substring = await smallArg("Substring to search:");
const lines = await smallArg("# surrounding lines in results:");

const PROJECT_ROOT = "/Users/jwisskirchen/IdeaProjects";
const CLOSE_LABEL = "Close";

// execute find java-files on all project-subdirs not starting with 'z' (as those are special ones...)
const results = await $`cd ${PROJECT_ROOT} ; find [^z]* -name *.java -exec grep -q ${substring} {} ';' -exec echo "******{}******" ';' -exec grep -${lines} ${substring} {} ';'`;

// Split filepaths and search results in tokens-array, replace '<' as this confuses html-rendering after span-insertion below
const tokens = results.toString().replaceAll('<', '&lt;').split('******');

// build templates from tokens with filepath header and search results in <pre>
const templates = [];
const files: string[] = [];
for (let i = 0; i < tokens.length - 1; i += 2) {
    files.push(`${tokens[i + 1]}`);

    // mark substrings in red.
    templates.push(`<h3>${tokens[i + 1]}</h3>
        <pre>${tokens[i + 2]}</pre><hr>`
        .replaceAll(`${substring}`,
            `<span class="text-red-500">${substring}</span>`)
    );
}

// show the templates => user can scroll in results and then press <CR> to continue to dialog for opening project in IDE
await div({
    html: templates.join('<br><br>\n'),
    width: 1200,
    height: 700
}, `bg-white text-black text-sm p-2`);

// put search string in clipboard for use in IDE later
await copy(substring);

//---- display buttons in widgets, that let you open IntelliJ Idea -----
const items = files.map(path => ({
    name: path,
    // display only shrinked filepath <project>/../<filename> for brevity
    display: path.slice(0, path.indexOf('/') + 1) + '..' + path.slice(path.lastIndexOf('/'), path.length)
}));
items.push({ name: CLOSE_LABEL, display: CLOSE_LABEL });
const buttons = `
  <div class="grid grid-col w-screen h-screen justify-around items-center">
      <label class="rounded px-10 py-1 bg-white text-black">Open project in IDEA</label>
      <button
      class="rounded px-10 py-1 bg-black bg-opacity-70 hover:bg-opacity-50"
      v-for="(item, index) in items" :key="item.name" :data-name="item.name" :data-index="index">{{ item.display }}</button>
  </div>  
  `;

let w = await widget(buttons, {
    backgroundColor: '#CCCCAA',
    x: 600,
    y: Math.max(0, 500 - items.length * 25),
    width: 600,
    height: items.length * 50 + 50,
    state: {
        items,
    }
});

w.onClick(async event => {
    if (event.dataset.name) {
        const path: string = event.dataset.name;

        if (path === CLOSE_LABEL) {
            w.close();
            exit(0);  // process keeps running without..
        } else {
            // open the project in IntelliJ IDEA
            await $`idea ${PROJECT_ROOT}/${path.slice(0, path.indexOf('/'))}`;
            // open the specific file chosen inside this project
            await $`idea ${PROJECT_ROOT}/${path}`;
            // inside IDEA (!) do a search Cmd-F for the substring 
            // Cmd-V places the substring from Clipboard (where we copied it above) into Ideas Search dialog
            await hide();
            await keyboard.pressKey(Key.LeftSuper, Key.F);
            await keyboard.releaseKey(Key.LeftSuper, Key.F);
            await keyboard.pressKey(Key.LeftSuper, Key.V);
            await keyboard.releaseKey(Key.LeftSuper, Key.V);
        }
    }
});