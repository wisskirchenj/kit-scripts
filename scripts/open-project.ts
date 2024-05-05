// Shortcut: cmd opt o
import "@johnlindquist/kit"

const PROJECT_ROOT = "/Users/juergen/IdeaProjects";

let bashOut = await $`cd ${PROJECT_ROOT} ; ls`;
const java = bashOut.toString().split('\n')
    .filter(name => name.length > 0 && !name.match("^zz_[jqpk][^l].*")).sort();
const python = await $`cd ${PROJECT_ROOT}/zz_python ; ls`;
const projects = java.concat(python.toString().split('\n')
    .filter(name => name.length > 0)
    .map(name => 'zz_python/' + name).sort());

//---- display buttons in widgets, that let you open IntelliJ Idea -----
const items = projects.map(path => ({
    name: path,
}));
const CLOSE_LABEL = 'Close';
items.push({ name: CLOSE_LABEL});
const buttons = `
  <div class="grid grid-cols-2 w-screen h-screen justify-around items-center">
      <label class="rounded px-10 py-1 bg-white text-black col-span-2">Open project in IDEA</label>
      <button
      class="rounded px-10 py-1 mx-5 my-0 bg-black bg-opacity-40 hover:bg-opacity-20"
      v-for="(item, index) in items" :key="item.name" :data-name="item.name" :data-index="index">{{ item.name }}</button>
  </div>  
  `;

let w = await widget(buttons, {
    backgroundColor: '#CCCCAA',
    x: 600,
    y: Math.max(0, 500 - items.length * 25),
    width: 800,
    height: items.length * 25 + 25,
    state: {
        items,
    }
});

w.onClick(async event => {
    if (event.dataset.name) {
        const project: string = event.dataset.name;

        if (project === CLOSE_LABEL) {
            w.close();
            exit(0);
        } else {
            await $`idea ${PROJECT_ROOT}/${project}`;
        }
    }
});
