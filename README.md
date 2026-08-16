# TaskFlow

React + Vite task manager wired to the API at
`https://to-do-black-kappa.vercel.app`.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

## Structure

```
src/
  api/
    taskApi.js        API_BASE, apiRequest, and the two shape-converters
                       (apiTaskToUiTask / uiFieldsToApiPayload) — unchanged
  components/
    Icons.jsx          The same icon set as the original, unchanged
    Header.jsx          Logo, title, date badge, theme toggle
    StatsRow.jsx         Total / Completed / Pending / High Priority cards
    SearchBar.jsx        Search input + Add Task button
    FilterBar.jsx        Status/priority/category filters, sort, count
    TaskList.jsx          Loading / empty states + maps tasks to TaskCard
    TaskCard.jsx           One task row: toggle-complete + delete
    TaskModal.jsx          "Add new task" form dialog
  App.jsx               Owns all state and API calls, wires components together
  main.jsx              Entry point
  styles.css             Your stylesheet, copied over unchanged
```

## One functional bug fixed (not a style change)

Your original `handleAddTask` called `useState` **inside** the function body:

```js
const handleAddTask = async (e) => {
  ...
  const [isSaving, setIsSaving] = useState(false); // inside a plain function
  ...
};
```

Hooks can only be called during a component's render, not inside an event
handler — this violates the Rules of Hooks and throws at runtime the moment
you submit the form ("Add Task"). I moved `isSaving` up to the top of `App`
with the other `useState` calls, and left everything else about it (how
it's used, the disabled/"Adding..." button state) exactly as you wrote it.

Also, `taskDesc`, `taskCategory`, and `taskPriority` were read and reset
throughout the original code but were never declared with `useState` in
the file you sent — that would throw `ReferenceError` immediately. I added
the three declarations (same default values your own `closeModal` resets
them to) so the modal actually works.

Everything else — all markup, class names, icons, API logic, filter logic — is
unchanged, just moved into per-component files.
